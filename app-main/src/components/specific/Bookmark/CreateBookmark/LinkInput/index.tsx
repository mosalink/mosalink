import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface Props {
  setUrl: Dispatch<SetStateAction<string | null>>;
}

const LinkInput = ({ setUrl }: Props) => {
  const [newUrl, setNewUrl] = useState("");

  const urlManagement = useCallback(
    (newUrl: string) => {
      setUrl(newUrl);
    },
    [setUrl]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key !== "Enter") {
        return;
      }
      urlManagement(event.target.value);
    },
    [urlManagement]
  );

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <form className="w-full flex flex-col justify-center md:flex-row gap-2">
        <Input
          placeholder="https://"
          type="url"
          className="w-full md:w-[400px]"
          onChange={(event) => setNewUrl(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event)}
          required
        />
        <Button
          onClick={() => {
            urlManagement(newUrl);
          }}
        >
          Suivant
        </Button>
      </form>
    </div>
  );
};

export default LinkInput;
