interface Props {
  children: string;
}

const SubtitleBoard = ({ children }: Props) => {
  return <p className="text-center text-lg">{children}</p>;
};

export default SubtitleBoard;
