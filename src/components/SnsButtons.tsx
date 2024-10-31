import { Box, Button, Card, Stack } from "@chakra-ui/react";
import {
  TwitterShareButton,
  LineShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { BsTwitterX } from "react-icons/bs";
import { FaLine, FaFacebook, FaWhatsapp } from "react-icons/fa";

type Props = {
  url: string;
};
export const SNSButtons = (props: Props) => {
  return (
    <Stack spacing={2} direction="row" justify="center">
      <TwitterShareButton
        url={props.url}
        title="ShibaLabで魔法の花を作りました!"
        hashtags={["ShibaLab", "芝浦祭"]}
      >
        <Card as={Button} w={12} h={12} borderRadius="full">
          <BsTwitterX />
        </Card>
      </TwitterShareButton>
      <LineShareButton url={props.url} title="ShibaLabで魔法の花を作りました!">
        <Card as={Button} w={12} h={12} borderRadius="full">
          <FaLine />
        </Card>
      </LineShareButton>
      <FacebookShareButton url={props.url} hashtag="#ShibaLab">
        <Card as={Button} w={12} h={12} borderRadius="full">
          <FaFacebook />
        </Card>
      </FacebookShareButton>
      <WhatsappShareButton
        url={props.url}
        title="ShibaLabで魔法の花を作りました!"
      >
        <Card as={Button} w={12} h={12} borderRadius="full">
          <FaWhatsapp />
        </Card>
      </WhatsappShareButton>
      <Card
        as={Button}
        w={{ base: "full", md: 32 }}
        h={12}
        borderRadius="full"
        rel="noopener"
        onClick={() => window.open("https://shibalab.com")}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <img
            src="/shibalab-logo-white.svg"
            alt="ShibaLab"
            style={{ height: "40%" }}
          />
          <Box as="span" fontSize="sm">
            WebSite
          </Box>
        </Box>
      </Card>
    </Stack>
  );
};
