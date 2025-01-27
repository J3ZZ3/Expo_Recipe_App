import React, { useContext } from 'react';
import { useRouter, Redirect } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/recipe-list" />;
}