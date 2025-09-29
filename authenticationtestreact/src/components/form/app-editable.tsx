import { Input, IconButton, Group } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuCheck, LuPencilLine } from "react-icons/lu";

interface AppEditableProps{
    defaultVal?: string; 
    placeholder?: string; 
    type?: string; 
    inputSize?: 'xs' | 'sm' |'md'| 'lg';
    onSubmitted?: (val: any) => void
}

function AppEditable({defaultVal="", placeholder="Enter your value", inputSize='sm', type="text", onSubmitted}:AppEditableProps) {
    const [focused, setIsFocused] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(false);
    const [val, setVal] = useState<string>(defaultVal);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(){
        onSubmitted?.(val);
        setChanged(false);
    }
  return (
    <>
    <Group attached w="full" maxW="md">
      <Input flex="1"
      bg={"gray.200"} 
      cursor={focused? "text" : "default"}
      type={type}
      ref={inputRef} 
      value={val}
      placeholder={placeholder} 
      size={inputSize} 
      disabled={!focused} 
      onChange={(e: any)=>{
        setVal(e.target.value)
      }} 
      onInput={()=> setChanged(true)}
      onBlur={()=> {setIsFocused(false);}}
      />
      {!changed &&
      <IconButton title='edit' variant="outline" bg={"gray.300"} size={inputSize} onClick={()=>{
        setIsFocused(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
      }}>
        <LuPencilLine />
        </IconButton>
      }

      {changed && 
        <IconButton title='edit' variant="outline" bg={"green.400"} size={inputSize} onClick={handleSubmit}>
        <LuCheck />
        </IconButton>
      }

    </Group>
    </>
  );
}

export default AppEditable;
