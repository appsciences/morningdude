import { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './src/firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, next => { setUser(next); setLoading(false); setMessage(''); setPassword(''); });
  }, []);
  useEffect(() => {
    setName('');
    if (!user || !db) return;
    return onSnapshot(doc(db, 'users', user.uid), snapshot => {
      setName(snapshot.data()?.displayName ?? '');
    }, () => setMessage('Could not load your profile. Check your connection and Firestore setup.'));
  }, [user]);
  async function authenticate(register: boolean) {
    if (!auth) return;
    setBusy(true); setMessage('');
    try {
      if (register) await createUserWithEmailAndPassword(auth, email.trim(), password);
      else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch { setMessage('Authentication failed. Check your email and password (at least 6 characters for a new account), then try again.'); }
    finally { setBusy(false); }
  }
  async function saveProfile() {
    if (!user || !db) return;
    setBusy(true); setMessage('');
    try {
      await setDoc(doc(db, 'users', user.uid), { displayName: name.trim(), updatedAt: serverTimestamp() }, { merge: true });
      setMessage('Profile saved.');
    } catch { setMessage('Could not save your profile. Please try again.'); }
    finally { setBusy(false); }
  }
  return <SafeAreaView style={styles.page}><StatusBar style="auto" /><View style={styles.card}>
    <Text style={styles.title}>Morning Dude</Text>
    {!firebaseConfigured ? <Text>Add your Firebase web app configuration to .env.local to get started. See README.md.</Text>
      : loading ? <Text>Loading…</Text>
      : user ? <>
        <Text>Signed in as {user.email}</Text>
        <TextInput accessibilityLabel="Display name" placeholder="Your name" value={name} onChangeText={setName} maxLength={100} style={styles.input} />
        <Button title="Save profile" disabled={busy} onPress={saveProfile} />
        <Button title="Sign out" disabled={busy} onPress={async () => { try { await signOut(auth!); } catch { setMessage('Could not sign out. Please try again.'); } }} />
      </> : <>
        <TextInput accessibilityLabel="Email" placeholder="Email" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput accessibilityLabel="Password" placeholder="Password" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} style={styles.input} />
        <Button title="Sign in" disabled={busy || !email.trim() || !password} onPress={() => authenticate(false)} />
        <Button title="Create account" disabled={busy || !email.trim() || password.length < 6} onPress={() => authenticate(true)} />
      </>}
    {!!message && <Text accessibilityRole="alert">{message}</Text>}
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f4ef', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', gap: 16 },
  title: { fontSize: 32, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 14, backgroundColor: 'white' },
});
