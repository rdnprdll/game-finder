"use client";
import { useEffect, useState } from "react";
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useLists(user) {
  const [saved, setSaved] = useState([]);
  const [hidden, setHidden] = useState([]);

  useEffect(() => {
    if (!user) {
      setSaved([]);
      setHidden([]);
      return;
    }
    const unsubSaved = onSnapshot(collection(db, "users", user.uid, "saved"), (snap) =>
      setSaved(snap.docs.map((d) => d.data()))
    );
    const unsubHidden = onSnapshot(collection(db, "users", user.uid, "hidden"), (snap) =>
      setHidden(snap.docs.map((d) => d.data().id))
    );
    return () => {
      unsubSaved();
      unsubHidden();
    };
  }, [user]);

  async function saveGame(game) {
    await setDoc(doc(db, "users", user.uid, "saved", String(game.id)), {
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
    await deleteDoc(doc(db, "users", user.uid, "saved", String(id)));
  }

  async function hideGame(game) {
    await setDoc(doc(db, "users", user.uid, "hidden", String(game.id)), {
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