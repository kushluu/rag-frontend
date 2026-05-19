// import { useEffect, useState } from "react";
// import { get } from "../api/http";
// import "./ConversationSidebar.css";
// import {deleteConversation} from "../endpoints/conversations"
// import ConfirmModal from "../components/ConfirmModal";

// interface Conversation {
//   id: number;
//   title?: string;
// }

// function getConversations() {
//   return get<Conversation[]>("/conversations/");
// }

// type Props = {
//   selectedConversationId: number | null;
//   onSelectConversation: (id: number | null) => void;
// };

// export default function ConversationSidebar({
//   selectedConversationId,
//   onSelectConversation,
// }: Props) {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const loadConversations = async () => {
//     const result = await getConversations();
//     if (result.success && result.data) {
//       setConversations(result.data);
//     }
//   };

//   useEffect(() => {
//     loadConversations();
//   }, []);

//   const handleDelete = async () => {
//     if (!deleteId) return;

//     await deleteConversation(deleteId); 
//     setDeleteId(null);
//     loadConversations();
//   };

// return (
//   <>
//     <div className="sidebar">
//       <div className="sidebar-top">
//         <button
//           className="new-chat-btn"
//           onClick={() => onSelectConversation(null)}
//         >
//           + New Chat
//         </button>
//       </div>

//       <div className="conversation-list">
//         {conversations.map((conversation) => (
//           <div key={conversation.id} className="conversation-item-wrapper">
//             <button
//               onClick={() => onSelectConversation(conversation.id)}
//               className={`conversation-item ${
//                 selectedConversationId === conversation.id ? "active" : ""
//               }`}
//             >
//               {conversation.title || `Conversation ${conversation.id}`}
//             </button>

//             <button
//               className="delete-btn"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setDeleteId(conversation.id);
//               }}
//             >
//               <img src="/3334328.png" alt="delete" />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>

//     <ConfirmModal
//       isOpen={!!deleteId}
//       message="Do you want to delete this chat?"
//       onCancel={() => setDeleteId(null)}
//       onConfirm={handleDelete}
//     />
//   </>
// )};


import "./ConversationSidebar.css";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { deleteConversation } from "../endpoints/conversations";

export type Conversation = {
  id: number;
  title?: string;
};

type Props = {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (id: number | null) => void;
  refreshConversations: () => Promise<void>;
};

export default function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  refreshConversations,
}: Props) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteConversation(deleteId);

    if (selectedConversationId === deleteId) {
      onSelectConversation(null);
    }

    setDeleteId(null);

    await refreshConversations();
  };

  return (
    <>
      <div className="sidebar">
        {/* top */}
        <div className="sidebar-top">
          <button
            className="new-chat-btn"
            onClick={() => onSelectConversation(null)}
          >
            + New Chat
          </button>
        </div>

        {/* conversation list */}
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="conversation-item-wrapper"
            >
              <button
                onClick={() =>
                  onSelectConversation(conversation.id)
                }
                className={`conversation-item ${
                  selectedConversationId === conversation.id
                    ? "active"
                    : ""
                }`}
              >
                {conversation.title ||
                  `Conversation ${conversation.id}`}
              </button>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(conversation.id);
                }}
              >
                <img src="/3334328.png" alt="delete" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        message="Do you want to delete this chat?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}