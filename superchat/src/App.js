import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useState, useRef } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyA6Ru0mlhOrEJyIdBZ5UF1OlZAFd3kqdqc",
  authDomain: "super-chat-331c3.firebaseapp.com",
  projectId: "super-chat-331c3",
  storageBucket: "super-chat-331c3.appspot.com",
  messagingSenderId: "402521353323",
  appId: "1:402521353323:web:c0c6a6c891725d6fa8952e",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

// Main page
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>
          <img src={require("./img/avatar.png")} alt="logo" />
        </h1>
        <SignOut></SignOut>
      </header>
      {/* Show either chatRoom or Sign in window depending on whether user is signed in or not */}
      <section>{user ? <ChatRoom></ChatRoom> : <SignIn></SignIn>}</ section>
    </div>
  );
}

// Sign in
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

// Sign out
function SignOut() {
  return (
    auth.currentUser && (
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign Out
      </button>
    )
  );
}

// Chatroom

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const key = 1;
  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue === " " || formValue === "") {
      return null;
    }
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  const dummy = useRef();
  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={key === 1 ? key : key + 1}
              message={msg}
            ></ChatMessage>
          ))}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

// Single chat message
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profile avatar"/>
      <p>{text}</p>
    </div>
  );
}

export default App;
