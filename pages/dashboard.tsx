import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Head from "next/head";
import type { Peep } from "../types/Peep";
import {
  fetchPeepStatsFromTheGraph,
  fetchPeepsFromTheGraph,
} from "../services/theGraphService";
import { fetchContentFromIPFS, postPeepToIPFS } from "../services/ipfsService";
import { commentPeep, likePeep, postPeep } from "../services/contractService";
import PeepItem from "../components/PeepItem";
import PeepCompose from "../components/PeepCompose";
import Header from "../components/Header";

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const [peeps, setPeeps] = useState<Peep[]>([]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    } else if (authenticated) {
      fetchPeeps();
    }
  }, [ready, authenticated, router]);

  // Fetching peeps function
  const fetchPeeps = async () => {
    try {
      const allPeeps = await fetchPeepsFromTheGraph();

      // Fetch content for each peep from IPFS
      const enrichedPeeps = await Promise.allSettled(
        allPeeps.map(async (peep: Peep) => {
          console.log("Fetching content for peep:", peep);

          peep.content = await fetchContentFromIPFS(peep.cid);

          // Fetch peep statistics (likes and comments)
          const stats = await fetchPeepStats(peep.peepIndex.toString());
          peep.comments = stats.comments;
          peep.likes = stats.likes;

          return peep;
        })
      );

      console.log("Enriched peeps:", enrichedPeeps);

      const sortedPeeps = enrichedPeeps
        .filter(
          (result): result is PromiseFulfilledResult<Peep> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value)
        .sort((a, b) => {
          return Number(b.timestamp) - Number(a.timestamp); // Descending order by timestamp
        });

      setPeeps(sortedPeeps);
      console.log("Peeps:", sortedPeeps);
    } catch (error) {
      console.error("Error fetching peeps:", error);
    }
  };

  const post = async (content: string, setContent: (value: string) => void) => {
    try {
      // Step 1: Post the peep to IPFS
      const cid = await postPeepToIPFS(content);
      console.log("Peep added to IPFS:", cid);

      // Step 2: Publish the CID to the smart contract
      const provider = await wallets[0]?.getEthersProvider();
      const signer = (await provider?.getSigner()) as any;

      await postPeep(cid, signer);
      console.log("Peep published successfully! IPFS CID: " + cid.toString());
      setContent("");
      alert("Peep published successfully! IPFS CID: " + cid.toString());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const like = async (peepIndex: number) => {
    try {
      // Step 1: Get the Ethereum signer
      const provider = await wallets[0]?.getEthersProvider();
      const signer = (await provider?.getSigner()) as any;

      // Step 2: Like the Peep using the signer
      await likePeep(peepIndex, signer);
      console.log(`Peep #${peepIndex} liked successfully!`);
      alert(`Peep #${peepIndex} liked successfully!`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error liking Peep #${peepIndex}: ${error}`);
    }
  };

  const comment = async (
    peepIndex: Number,
    comment: string,
    setComment: (value: string) => void
  ) => {
    try {
      // Step 1: Post the comment to IPFS
      const cid = await postPeepToIPFS(comment); // Assuming postPeepToIPFS can be reused for comments
      console.log("Comment added to IPFS:", cid);

      // Step 2: Publish the CID to the smart contract as a comment on the specified peep
      const provider = await wallets[0]?.getEthersProvider();
      const signer = (await provider?.getSigner()) as any;

      await commentPeep(peepIndex, cid, signer);
      console.log(
        "Comment published successfully! IPFS CID: " + cid.toString()
      );

      setComment(""); // Clear the comment field
      alert("Comment published successfully! IPFS CID: " + cid.toString());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchPeepStats = async (peepIndex: string) => {
    try {
      return await fetchPeepStatsFromTheGraph(peepIndex);
    } catch (error) {
      console.error("Error fetching stats for peep:", peepIndex, error);
      return {
        comments: 0,
        likes: 0,
      };
    }
  };

  return (
    <>
      <Head>
        <title>Chirp</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <Header onLogout={logout} />

            <div className="space-y-4">
              <PeepCompose onPost={post} />

              {peeps.map((peep, index) => (
                <PeepItem key={index} peep={peep} onLike={like} onComment={comment} />
              ))}
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}
