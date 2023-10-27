// components/PeepItem.tsx
import React, { useEffect, useState } from "react";
import type { Peep } from "../types/Peep";
import { fetchPeepCommentsFromTheGraph } from "../services/theGraphService";
import { fetchContentFromIPFS } from "../services/ipfsService";

interface PeepItemProps {
  peep: Peep;
  onLike: (peepIndex: number) => void;
  onComment: (
    peepIndex: number,
    comment: string,
    setCommentField: (value: string) => void,
    setComments: React.Dispatch<React.SetStateAction<{ cid: string; comment: string }[]>>
  ) => void;
}

const PeepItem: React.FC<PeepItemProps> = ({ peep, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ cid: string; comment: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rawComments, setRawComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchCommentContents = async () => {
      const contents = [];
      for (let comment of comments) {
        const content = await fetchContentFromIPFS(comment.cid);
        contents.push(content);
      }
      setRawComments(contents);
    };

    if (comments.length) {
      fetchCommentContents();
    }
  }, [comments]);

  const toggleComments = async () => {
    if (!showComments) {
      const fetchedComments = await fetchPeepCommentsFromTheGraph(
        peep.peepIndex.toString()
      );
      setComments(fetchedComments.comments);
    }
    setShowComments(!showComments);
  };

  return (
    <div className="rounded-md p-6 bg-box-color shadow-sm mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{peep.user}</h3>
          <p className="text-gray-700 mt-2">{peep.content}</p>
          <p className="text-gray-500 mt-4 text-sm">
            {new Date(Number(peep.timestamp) * 1000).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
          <div className="flex mt-4 space-x-6">
            <button
              className="flex items-center space-x-2"
              onClick={toggleComments}
            >
              <span className="font-semibold">{peep.comments}</span>
              <span>Comments</span>
            </button>
            <button
              className="flex items-center space-x-2"
              onClick={() => onLike(peep.peepIndex)}
            >
              <span className="font-semibold">{peep.likes}</span>
              <span>Likes</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4">
          {comments.length === 0 ? (
            <div className="mt-2 text-gray-500">No comments yet</div>
          ) : (
            rawComments.map((content, index) => (
              <div key={comments[index]?.cid} className="mt-2">
                {content}
              </div>
            ))
          )}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-md p-2 mt-4"
            rows={2}
          ></textarea>

          <button
            onClick={() =>
              onComment(peep.peepIndex, newComment, setNewComment, setComments)
            }
            className="mt-2 bg-duck-body hover:bg-duck-eye text-duck-eye hover:text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default PeepItem;
