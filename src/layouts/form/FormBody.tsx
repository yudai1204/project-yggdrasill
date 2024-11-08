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
import { useState, useEffect, useRef, useCallback } from "react";
import "@fontsource/kaisei-opti";
import { questions, options, questionSummary } from "./questions";
import { ColorPicker } from "@/components/ColorPicker";
import { P5Canvas } from "@/components/P5Canvas";
import { generateTintColors } from "@/util/util";

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
  const formRef = useRef<HTMLDivElement | null>(null);

  const [activeQuestion, setActiveQuestion] = useState<number | undefined>(
    undefined
  );
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [flowerColors, setFlowerColors] = useState<string[] | undefined>(
    undefined
  );

  useEffect(() => {
    setActiveQuestion(0);
    setTimeout(() => {
      const savedAnswers = localStorage.getItem("answers");
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }, 500);
  }, []);

  const saveFormInput = useCallback(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, []);

  useEffect(() => {
    // スクロールする
    if (activeQuestion !== undefined && formRef.current) {
      console.log("activeQuestion", activeQuestion);
      const target = activeQuestion * 100;
      const current = formRef.current.scrollTop;
      console.log("current", current);
      formRef.current.scrollTo({
        top: target,
        // behavior: "smooth",
      });
    }
  }, [activeQuestion, formRef]);

  const handleAnswer = useCallback(
    (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
      if (index < questions.en.length - 1 && index !== 0) {
        setTimeout(() => {
          setActiveQuestion(index + 1);
        }, 100);
      }
    },
    [answers, setActiveQuestion, setAnswers]
  );

  const handleTextInput = useCallback(
    (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    },
    [answers, setAnswers]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prevLang) => (prevLang === "en" ? "jp" : "en"));
  }, [setLanguage]);

  return (
    <>
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={1}
        backgroundColor="#1A202C"
        transition="all 1.5s ease-in-out"
        opacity={opacity}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={2}
        transition="all 1.5s ease-in-out"
        opacity={opacity * 0.4}
        filter="blur(5px)"
      >
        {flowerColors && <P5Canvas colors={flowerColors} />}
      </Box>
      <Box
        ref={formRef}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={3}
        pt={8}
        px={5}
        overflow="auto"
        transition="all 1.5s ease-in-out"
        opacity={opacity}
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
          {questions[language].map((question, index) => {
            const style =
              index === activeQuestion || !answers[index]
                ? {}
                : { opacity: 0.8 };
            return (
              <AccordionItem key={index}>
                <AccordionButton onClick={() => setActiveQuestion(index)}>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontWeight={activeQuestion === index ? "bold" : "normal"}
                    fontFamily="Kaisei Opti"
                  >
                    <span style={style}>{index + 1}. </span>
                    {index === activeQuestion || !answers[index] ? (
                      <span style={style}>{question}</span>
                    ) : (
                      <>
                        <span style={style}>
                          {questionSummary[language][index]}:{" "}
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            borderRadius: "5px",
                            fontWeight: index === 0 ? "bold" : "normal",
                            backgroundColor:
                              index === 0 ? answers[index] : "inherit",
                            opacity: index === 0 ? 1 : style.opacity,
                            padding: index === 0 ? "0 5px" : "0",
                            color: index === 0 ? fontColor : "inherit",
                          }}
                        >
                          {answers[index]}
                        </span>
                      </>
                    )}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {index === 0 && (
                    <Box>
                      <Box width="fit-content" margin="auto">
                        <ColorPicker
                          onChange={(color) => {
                            handleAnswer(index, color);
                            setFlowerColors(generateTintColors(color, 3));
                          }}
                          onClickOk={() => setActiveQuestion(index + 1)}
                          setFontColor={setFontColor}
                        />
                      </Box>
                      <Button
                        onClick={() => setActiveQuestion(index + 1)}
                        fontFamily="Kaisei Opti"
                        marginTop="5"
                        w="100%"
                        variant="solid"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </Box>
                  )}
                  {index === 1 && (
                    <HStack spacing={0}>
                      <Input
                        placeholder={
                          language === "en" ? "Type your answer" : "回答を入力"
                        }
                        value={answers[index] || ""}
                        onChange={(e) => handleTextInput(index, e.target.value)}
                        fontFamily="Kaisei Opti"
                        borderRightRadius={0}
                        maxLength={language === "en" ? 20 : 12}
                        onKeyDown={(e) => {
                          const event =
                            e as React.KeyboardEvent<HTMLInputElement>;
                          if (
                            event.key === "Enter" &&
                            !event.nativeEvent.isComposing
                          ) {
                            setActiveQuestion(index + 1);
                          }
                        }}
                      />
                      <Button
                        onClick={() => setActiveQuestion(index + 1)}
                        fontFamily="Kaisei Opti"
                        borderLeftRadius={0}
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </HStack> // 追加
                  )}
                  {index > 1 && (
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
            );
          })}
        </Accordion>
        {(activeQuestion === questions.en.length - 1 ||
          !answers.includes(undefined)) && (
          <Button
            isLoading={isLoading}
            mb={5}
            colorScheme="teal"
            width="100%"
            marginTop="5"
            opacity={answers.includes(undefined) ? 0.5 : 1}
            onClick={() => {
              if (!answers.includes(undefined)) {
                // if (
                //   answers[0]?.match(
                //     /無視|命令|ください|プロンプト|ignore|command|prompt|/i
                //   )
                // ) {
                //   alert(
                //     "申し訳ありませんが、その名前は使用できません。\nSorry, that name is not allowed."
                //   );
                //   return;
                // }
                submitAnswers();
                saveFormInput();
              }
            }}
            fontFamily="Kaisei Opti"
          >
            {language === "en" ? "Submit" : "送信"}
          </Button>
        )}
      </Box>
    </>
  );
};
