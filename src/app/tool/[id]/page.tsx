import ToolDetailsClient from './ToolDetailsClient';

export default async function ToolDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return <ToolDetailsClient toolId={resolvedParams.id} />;
} 