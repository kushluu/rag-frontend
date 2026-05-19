// import { useEffect, useRef, useState } from "react";
// import { streamChat } from "../api/stream";
// import ConversationSidebar from "../components/ConversationSidebar";
// import { getConversationDetail } from "../endpoints/conversations";
// import { post } from "../api/http";
// import "./Chat.css";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };
// type ConversationResponse = {
//   id: number;
// };

// export default function Chat() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [streamingMsg, setStreamingMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedConversationId, setSelectedConversationId] =
//     useState<number | null>(null);

//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // 🔥 Auto scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, streamingMsg]);

//   // 🔥 Load messages when conversation changes
//   useEffect(() => {
//     if (!selectedConversationId) {
//       setMessages([]);
//       return;
//     }

//     const loadMessages = async () => {
//       const res = await getConversationDetail(selectedConversationId);

//       if (res.success && res.data) {
//         setMessages(res.data.messages);
//       }
//     };

//     loadMessages();
//   }, [selectedConversationId]);

//   // 🔥 Ensure conversation exists
//   const ensureConversation = async () => {
//     if (selectedConversationId) return selectedConversationId;

//     console.log("🆕 creating conversation...");

//     const res = await post<ConversationResponse>("/conversations/", {});

//     if (res.success && res.data) {
//       const newId = res.data.id;
//       setSelectedConversationId(newId);

//       // 🔥 notify sidebar
//       window.dispatchEvent(new Event("conversation-updated"));

//       return newId;
//     }

//     throw new Error("Failed to create conversation");
//   };

//   // 🔥 FILE UPLOAD
//   const handleFileUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     console.log("🔥 file upload triggered");

//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const convoId = await ensureConversation();

//       console.log("📌 using convo:", convoId);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("filename", file.name);
//       formData.append("conversation_id", String(convoId));

//       console.log("🚀 uploading file...");

//       await fetch("http://localhost:8000/api/documents/upload/", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       console.log("✅ upload success");

//       // optional UI feedback
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: `📄 File "${file.name}" uploaded`,
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }

//     e.target.value = ""; // 🔥 reset
//   };

//   // 🔥 SEND MESSAGE
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     let convoId = selectedConversationId;

//     try {
//       convoId = await ensureConversation();
//     } catch (err) {
//       console.error(err);
//       return;
//     }

//     const userMessage = input;
//     let fullResponse = "";

//     // add user message
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: userMessage },
//     ]);

//     setInput("");
//     setStreamingMsg("");
//     setLoading(true);

//     try {
//       await streamChat(userMessage, convoId, (chunk) => {
//         fullResponse += chunk;
//         setStreamingMsg((prev) => prev + chunk);
//       });

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: fullResponse },
//       ]);

//       setStreamingMsg("");
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Something went wrong" },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <ConversationSidebar
//         selectedConversationId={selectedConversationId}
//         onSelectConversation={setSelectedConversationId}
//       />

//       {/* Chat Area */}
//       <div className="chat-main">
//         {/* Messages */}
//         <div className="chat-messages">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`chat-row ${
//                 msg.role === "user" ? "user" : "assistant"
//               }`}
//             >
//               <div
//                 className={`chat-bubble ${
//                   msg.role === "user" ? "user" : "assistant"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             </div>
//           ))}

//           {/* streaming */}
//           {streamingMsg && (
//             <div className="chat-row assistant">
//               <div className="chat-bubble assistant">
//                 {streamingMsg}
//               </div>
//             </div>
//           )}

//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className="chat-input-container">
//           {/* hidden file input */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileUpload}
//             style={{ display: "none" }}
//           />

//           {/* upload button */}
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="upload-btn"
//           >
//             📎
//           </button>

//           <input
//             className="chat-input"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             disabled={loading}
//             placeholder="Type a message..."
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleSend();
//             }}
//           />

//           <button
//             className="chat-button"
//             onClick={handleSend}
//             disabled={loading}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import ConversationSidebar, {
  Conversation,
} from "../components/ConversationSidebar";

import { streamChat } from "../api/stream";
import { post, get } from "../api/http";
import { getConversationDetail } from "../endpoints/conversations";

import "./Chat.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ConversationResponse = {
  id: number;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMsg, setStreamingMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMsg]);

  // Load conversations
  const loadConversations = async () => {
    const res = await get<Conversation[]>("/conversations/");
    if (res.success && res.data) {
      setConversations(res.data);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages from backend — single source of truth
  const loadMessages = async (convoId: number) => {
    const res = await getConversationDetail(convoId);
    if (res.success && res.data) {
      setMessages(res.data.messages);
    }
  };

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    // No loading guard — always fetch when conversation changes
    loadMessages(selectedConversationId);
  }, [selectedConversationId]);

  // Ensure conversation exists
  const ensureConversation = async () => {
    if (selectedConversationId) return selectedConversationId;

    const res = await post<ConversationResponse>("/conversations/", {});

    if (res.success && res.data) {
      const newId = res.data.id;
      setSelectedConversationId(newId);
      await loadConversations();
      return newId;
    }

    throw new Error("Failed to create conversation");
  };

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const convoId = await ensureConversation();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversation_id", String(convoId));

      await fetch("http://localhost:8000/api/documents/upload/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `📄 File "${file.name}" uploaded`,
        },
      ]);
    } catch (err) {
      console.error(err);
    }

    e.target.value = "";
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    let convoId = selectedConversationId;

    try {
      convoId = await ensureConversation();
    } catch (err) {
      console.error(err);
      return;
    }

    const userMessage = input;

    // Optimistically show user message while waiting for stream
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setStreamingMsg("");
    setLoading(true);

    try {
      await streamChat(userMessage, convoId, (chunk) => {
        setStreamingMsg((prev) => prev + chunk);
      });

      // After stream completes, sync from backend — single source of truth.
      // This replaces the optimistic message + streamed assistant reply with
      // what's actually persisted, so refresh never causes duplicates.
      await loadMessages(convoId);
      setStreamingMsg("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        refreshConversations={loadConversations}
      />

      {/* Main */}
      <div className="chat-main">
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-row ${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div
                className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Streaming — shown during stream, cleared after loadMessages */}
          {streamingMsg && (
            <div className="chat-row assistant">
              <div className="chat-bubble assistant">{streamingMsg}</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="upload-btn"
          >
            📎
          </button>

          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button className="chat-button" onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}