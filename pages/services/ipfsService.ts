// services/ipfsService.ts
export const fetchContentFromIPFS = async (cid: string) => {
  const contentResponse = await fetch(`https://ipfs.io/ipfs/${cid}`);
  const contentText = await contentResponse.text();
  try {
    const contentData = JSON.parse(contentText);
    return contentData.content;
  } catch (error) {
    return contentText;
  }
};

export const postPeepToIPFS = async (content: string) => {
  const response = await fetch("/api/publishPeep", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  return data.Hash;
};
