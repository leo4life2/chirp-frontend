// services/theGraphService.ts
const QUERY_URL = "https://api.studio.thegraph.com/query/48252/chirpv2/version/latest";

export const fetchPeepsFromTheGraph = async () => {
    const response = await fetch(QUERY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
            {
              newPeeps {
                peepIndex
                user
                cid
                timestamp
              }
            }
          `,
        }),
    });

    const data = await response.json();
    return data.data.newPeeps;
};

export const fetchPeepStatsFromTheGraph = async (peepIndex: string) => {
    const response = await fetch(QUERY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
          {
            newComments(where: {peepIndex: "${peepIndex}"}) {
              id
            }
            newLikes(where: {peepIndex: "${peepIndex}"}) {
              id
            }
          }
          `,
        }),
    });

    const data = await response.json();
    return {
        comments: data.data.newComments.length,
        likes: data.data.newLikes.length,
    };
};

export const fetchPeepCommentsFromTheGraph = async (peepIndex: string) => {
  const response = await fetch(QUERY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          query: `
        {
          newComments(where: {peepIndex: "${peepIndex}"}) {
            cid
          }
        }
        `,
      }),
  });

  const data = await response.json();
  return {
      comments: data.data.newComments
  };
};