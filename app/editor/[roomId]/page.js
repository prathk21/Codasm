import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Editor  from '../../components/Editor';

export default function RoomPage({ params }) {
  const { roomId } = params;

  if (!roomId) {
    notFound();
  }

  return <Editor roomId={roomId} />;
}

export async function generateStaticParams() {
  return [];
}
