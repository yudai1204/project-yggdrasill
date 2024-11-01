import { GptAnalysis } from "@/types/metaData";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Result } from "@/layouts/result";
import { rmvCaptl } from "@/util/util";
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // 事前に生成するパスがない場合は空の配列
    fallback: "blocking", // UUIDが何であっても対応するために'blocking'を使用
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const uuid = params?.uuid as string;

  if (!uuid || typeof uuid !== "string") {
    return {
      props: { notFound: true, uuid: "" },
    };
  }

  // UUIDの検証やデータ取得が必要な場合はここで行う
  const origin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://yggdrasill.shibalab.com";
  const response = await fetch(`${origin}/api/proxy?uuid=${uuid}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  const json = await response.json();
  const gptAnalysis = JSON.parse(json.gpt_result);
  const answers = JSON.parse(json.answers);

  return {
    props: {
      uuid,
      notFound: false,
      gptAnalysis,
      answers,
    },
  };
};

interface Props {
  uuid: string;
  notFound: boolean;
  gptAnalysis: GptAnalysis;
  answers: string[];
}

const UuidPage = (props: Props) => {
  const { uuid, notFound, gptAnalysis, answers } = props;

  const title = encodeURIComponent(
    "Magical " + rmvCaptl(gptAnalysis.flowerType, false)
  );
  const subtitle = encodeURIComponent(`${gptAnalysis.userName}が咲かせた花は`);
  const ogImageUrl = `https://yggdrasill.shibalab.com/api/og?title=${title}&subtitle=${subtitle}`;

  const router = useRouter();

  // ページがまだ生成されていない場合のローディング状態
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <div>Error: UUID not found</div>;
  }

  return (
    <>
      <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta
          property="og:title"
          content="Let the magic flower bloom - ShibaLab"
        />
        <title>Project Yggdrasil - ShibaLab</title>
      </Head>
      <Result
        gptAnalysis={gptAnalysis}
        answers={answers}
        isShared
        shareUrl={`https://yggdrasill.shibalab.com/share/${uuid}`}
      />
    </>
  );
};

export default UuidPage;
