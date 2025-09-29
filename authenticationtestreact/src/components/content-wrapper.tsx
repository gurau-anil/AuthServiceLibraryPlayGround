import { Box, Flex, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";

function AppWrapper({title, children}:{title?: string, children?: ReactNode}) {
    return ( 
    <>
        <Flex direction={"Column"} gap={4}>
            {title && 
            <Box>
                <Heading size={"xl"}>{title}</Heading>
            </Box>
            }
            
            <Box>
                {children}
            </Box>
        </Flex>
    </> 
    );
}

export default AppWrapper;