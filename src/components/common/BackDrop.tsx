const BackDrop = ({ content }: { content: React.ReactNode }) => {
  return <div className="fixed inset-0 bg-black/30 z-40">{content}</div>;
};

export default BackDrop;
