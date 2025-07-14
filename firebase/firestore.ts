import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface StudyMaterial {
  id?: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: Date;
  subject: string;
}

export interface TestResult {
  id?: string;
  studentId: string;
  studentName: string;
  testName: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  testDate: Date;
  enteredBy: string;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface TimetableEntry {
  id?: string;
  subject: string;
  time: string;
  day: string;
  faculty: string;
  room: string;
}

// Study Materials
export const addStudyMaterial = async (material: Omit<StudyMaterial, 'id'>) => {
  const docRef = await addDoc(collection(db, 'studyMaterials'), {
    ...material,
    uploadedAt: Timestamp.fromDate(material.uploadedAt)
  });
  return docRef.id;
};

export const getStudyMaterials = async (): Promise<StudyMaterial[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, 'studyMaterials'), orderBy('uploadedAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    uploadedAt: doc.data().uploadedAt.toDate()
  })) as StudyMaterial[];
};

// Test Results
export const addTestResult = async (result: Omit<TestResult, 'id'>) => {
  const docRef = await addDoc(collection(db, 'testResults'), {
    ...result,
    testDate: Timestamp.fromDate(result.testDate)
  });
  return docRef.id;
};

export const getTestResultsByStudent = async (studentId: string): Promise<TestResult[]> => {
  const q = query(
    collection(db, 'testResults'), 
    where('studentId', '==', studentId),
    orderBy('testDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    testDate: doc.data().testDate.toDate()
  })) as TestResult[];
};

export const getAllTestResults = async (): Promise<TestResult[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, 'testResults'), orderBy('testDate', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    testDate: doc.data().testDate.toDate()
  })) as TestResult[];
};

// Announcements
export const addAnnouncement = async (announcement: Omit<Announcement, 'id'>) => {
  const docRef = await addDoc(collection(db, 'announcements'), {
    ...announcement,
    createdAt: Timestamp.fromDate(announcement.createdAt)
  });
  return docRef.id;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, 'announcements'), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Announcement[];
};

// Timetable
export const getTimetable = async (): Promise<TimetableEntry[]> => {
  const querySnapshot = await getDocs(collection(db, 'timetable'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as TimetableEntry[];
};

export const addTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>) => {
  const docRef = await addDoc(collection(db, 'timetable'), entry);
  return docRef.id;
};