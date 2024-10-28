import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { TbLanguageHiragana } from "react-icons/tb";
import { useState, useEffect } from "react";
import "@fontsource/kaisei-opti";
import { questions, options, questionSummary } from "./questions";

type Props = {
  submitAnswers: () => void;
  isLoading: boolean;
  setAnswers: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
  answers: (string | undefined)[];
  setLanguage: React.Dispatch<React.SetStateAction<"en" | "jp">>;
  language: "en" | "jp";
  opacity: number;
};
export const FormBody = (props: Props) => {
  const {
    submitAnswers,
    isLoading,
    setAnswers,
    answers,
    setLanguage,
    language,
    opacity,
  } = props;

  const [activeQuestion, setActiveQuestion] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setActiveQuestion(0);
  }, []);

  const handleAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (index < questions.en.length - 1) {
      setTimeout(() => {
        setActiveQuestion(index + 1);
      }, 100);
    }
  };

  const handleTextInput = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "jp" : "en"));
  };
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      transition="all 1.5s ease-in-out"
      opacity={opacity}
      zIndex={1}
      backgroundColor="#1A202C"
      pt={8}
      px={5}
    >
      <Heading
        as="h2"
        size="lg"
        marginBottom="5"
        textAlign="center"
        fontFamily="Kaisei Opti"
      >
        {language === "en"
          ? "Let the Magic Flower Bloom"
          : "魔法の花を咲かせよう"}
      </Heading>
      <Button
        variant="outline"
        aria-label="Switch Language"
        onClick={toggleLanguage}
        marginBottom="5"
        size="sm"
      >
        <Icon as={TbLanguageHiragana} />
        <Text marginLeft="2">{language === "en" ? "日本語" : "English"}</Text>
      </Button>
      <Accordion allowToggle index={activeQuestion}>
        {questions[language].map((question, index) => (
          <AccordionItem key={index}>
            <AccordionButton onClick={() => setActiveQuestion(index)}>
              <Box
                flex="1"
                textAlign="left"
                fontWeight={activeQuestion === index ? "bold" : "normal"}
                opacity={index === activeQuestion || !answers[index] ? 1 : 0.7}
                fontFamily="Kaisei Opti"
              >
                {index + 1}.{" "}
                {index === activeQuestion || !answers[index]
                  ? question
                  : `${questionSummary[language][index]}: ${answers[index]}`}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {index === 0 ? ( // 例として1番目の質問を自由入力に変更
                <HStack spacing={0}>
                  <Input
                    placeholder={
                      language === "en" ? "Type your answer" : "回答を入力"
                    }
                    value={answers[index] || ""}
                    onChange={(e) => handleTextInput(index, e.target.value)}
                    fontFamily="Kaisei Opti"
                    borderRightRadius={0}
                  />
                  <Button
                    onClick={() => setActiveQuestion(index + 1)}
                    fontFamily="Kaisei Opti"
                    borderLeftRadius={0}
                  >
                    {language === "en" ? "Next" : "次へ"}
                  </Button>
                </HStack> // 追加
              ) : (
                <RadioGroup
                  onChange={(value) => handleAnswer(index, value)}
                  value={answers[index]}
                >
                  <VStack align="start">
                    {options[language][index].map((option, idx) => (
                      <Radio key={idx} value={option}>
                        <Text fontFamily="Kaisei Opti">{option}</Text>
                      </Radio>
                    ))}
                  </VStack>
                </RadioGroup>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {activeQuestion === questions.en.length - 1 && (
        <Button
          isLoading={isLoading}
          colorScheme="teal"
          width="100%"
          marginTop="5"
          opacity={answers.includes(undefined) ? 0.5 : 1}
          onClick={() => {
            !answers.includes(undefined) && submitAnswers();
          }}
          fontFamily="Kaisei Opti"
        >
          {language === "en" ? "Submit" : "送信"}
        </Button>
      )}
    </Box>
  );
};
