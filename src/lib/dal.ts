import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  disableNetwork,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  loadBundle,
  query,
  Query,
  serverTimestamp,
  setDoc,
  updateDoc,
  orderBy,
  where,
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore'
import {fbGetApp, fbGetCurrentUser, fbGetLogin} from 'src/lib/myfirebase'

interface User {
  id: string
  name?: string
  handle?: string
  avatar?: string
}

interface Message {
  user: User
  text: string
  createdAt?: Timestamp // timestamp
}


interface MessageEx {
  userDisplayName: string
}

export async function dbUpsertMessage(msg:Message): Promise<DocumentReference> {
  const uid = fbGetLogin()?.uid
  if (uid) {
    msg.user = {id: uid}
    msg.createdAt = serverTimestamp()
    const db = getFirestore(fbGetApp())
    const doc = await addDoc(collection(db, 'message' ), msg)
    return doc
  } else {
    // Prereq failed
    throw 'tried to dbUpsertMessage without login id'
  }

}

export async function dbGetMyMessages(): Promise<Array<QueryDocumentSnapshot<DocumentData>>> {
  const db = getFirestore(fbGetApp())
  const currentUserId = fbGetLogin()?.uid
  if (currentUserId) {
    const docs = await getDocs(query(collection(db, 'message'), where('userid', '==', currentUserId)))
    return docs.docs
  } else {
    return []
  }
}

export async function dbGetAllMessages(): Promise<Array<QueryDocumentSnapshot<DocumentData>>> {
  const db = getFirestore(fbGetApp())
  const currentUserId = fbGetLogin()?.uid
  if (currentUserId) {
    const docs = await getDocs(query(collection(db, 'message'), orderBy('createdAt', 'desc')))
    return docs.docs
  } else {
    return []
  }
}
