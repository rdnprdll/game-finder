"use client";
import { useEffect, useState } from "react";
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useLists(user) {
  const uid = user?.uid;

  // remember which user the data belongs to, so one user's list never shows for another
  const [savedState, setSavedState] = useState({ uid: null, items: [] });
  const [hiddenState, setHiddenState] = useState({ uid: null, items: [] });

  useEffect(() => {
    if (!uid) return;

    const unsubSaved = onSnapshot(collection(db, "users", uid, "saved"), (snap) =>
      setSavedState({ uid, items: snap.docs.map((d) => d.data()) })
    );
    const unsubHidden = onSnapshot(collection(db, "users", uid, "hidden"), (snap) =>
      setHiddenState({ uid, items: snap.docs.map((d) => d.data().id) })
    );

    return () => {
      unsubSaved();
      unsubHidden();
    };
  }, [uid]);

  const saved = uid && savedState.uid === uid ? savedState.items : [];
  const hidden = uid && hiddenState.uid === uid ? hiddenState.items : [];

  async function saveGame(game) {
    await setDoc(doc(db, "users", uid, "saved", String(game.id)), {
      id: game.id,
      name: game.name,
      image: game.image || null,
      released: game.released || null,
      rating: game.rating || 0,
      genres: game.genres || [],
      platforms: game.platforms || [],
      reason: game.reason || "",
      savedAt: serverTimestamp(),
    });
  }

  async function unsaveGame(id) {
    await deleteDoc(doc(db, "users", uid, "saved", String(id)));
  }

  async function hideGame(game) {
    await setDoc(doc(db, "users", uid, "hidden", String(game.id)), {
      id: game.id,
      name: game.name,
      hiddenAt: serverTimestamp(),
    });
  }

  return {
    saved,
    hidden,
    savedIds: new Set(saved.map((g) => g.id)),
    saveGame,
    unsaveGame,
    hideGame,
  };
}