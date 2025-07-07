import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getNameToUrl } from "@/utils/url/utils";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface Props {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}

const TagsInput = ({ tags, setTags }: Props) => {
  const [message, setMessage] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key !== "Enter") {
        return;
      }
      if (tags.find((tag) => tag === event.target.value)) {
        return setMessage("Ce tag existe déjà");
      }
      if (event.target.value.length === 0) {
        return setMessage("Le tag ne peut pas être vide");
      }
      if (
        tags.reduce(
          (acc, tag) => acc + tag.length,
          0 + event.target.value.length
        ) > 40
      ) {
        return setMessage("Vous êtes limité à 40 caractères");
      }
      setTags([...tags, getNameToUrl(event.target.value)]);
      setValue("");
      return;
    },
    [setTags, tags]
  );

  return (
    <div className="flex w-full md:w-96 flex-wrap gap-2 items-center border rounded-sm p-2">
      {tags.length > 0 &&
        tags.map((tag) => {
          return (
            <Badge key={tag} variant={"outline"} className="gap-2">
              {tag}{" "}
              <X
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag));
                  setMessage(null);
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </Badge>
          );
        })}
      <Input
        value={value}
        type="text"
        placeholder="Ajouter un tag..."
        className="border-none w-auto"
        onKeyDown={(event) => handleKeyDown(event)}
        onChange={(e) => {
          setMessage(null);
          setValue(e.target.value);
        }}
      />
      <p className="text-red-500 text-sm">{message}</p>
    </div>
  );
};

export default TagsInput;
