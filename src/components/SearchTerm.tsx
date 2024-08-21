interface Props {
  deleteFunction: (tag: string) => void;
  tag: string;
  index: number;
}
const SearchTerm: React.FC<Props> = ({ tag, index, deleteFunction }) => {
  const tagType: string = tag.split("/")[0];
  switch (tagType) {
    case "a":
      return (
        <span
          key={index}
          className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2"
        >
          <i className="fas fa-user text-gray-400" />
          {tag.split("/")[1]}
          <i
            className="fas fa-times text-gray-600 cursor-pointer hover:text-red-500"
            onClick={() => deleteFunction(tag)}
          />
        </span>
      );
    case "b":
      return (
        <span
          key={index}
          className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2"
        >
          <i className="fas fa-music text-gray-400" />
          {tag.split("/")[1]}
          <i
            className="fas fa-times text-gray-600 cursor-pointer hover:text-red-500"
            onClick={() => deleteFunction(tag)}
          />
        </span>
      );
    case "d":
      return (
        <span
          key={index}
          className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2"
        >
          <i className="fas fa-clock text-gray-400" />
          {tag.split("/")[1]}
          <i
            className="fas fa-times text-gray-600 cursor-pointer hover:text-red-500"
            onClick={() => deleteFunction(tag)}
          />
        </span>
      );
    case "t":
      return (
        <span
          key={index}
          className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2"
        >
          <i className="fas fa-tag text-gray-400" />
          {tag.split("/")[1]}
          <i
            className="fas fa-times text-gray-600 cursor-pointer hover:text-red-500"
            onClick={() => deleteFunction(tag)}
          />
        </span>
      );
  }
  return (
    <span
      key={index}
      className="bg-gray-100 py-2 px-4 rounded-full flex items-center gap-2"
    >
      <i className="fas fa-tag text-gray-400" />
      {tag}
      <i
        className="fas fa-times text-gray-600 cursor-pointer hover:text-red-500"
        onClick={() => deleteFunction(tag)}
      />
    </span>
  );
};

export default SearchTerm;
