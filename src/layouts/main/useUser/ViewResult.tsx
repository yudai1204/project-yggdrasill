import type { UserType } from "@/types/calibrate";
import { Result } from "@/layouts/result";

type Props = {
  currentUser: UserType | null;
};

export const ViewResult = (props: Props) => {
  const { currentUser } = props;
  if (currentUser == null || currentUser.metadata == null) {
    return (
      <>
        <h1>Error: User is null</h1>
      </>
    );
  }
  return (
    <Result
      shareUrl={`https://yggdrasill.shibalab.com/share?uuid=${currentUser.uuid}`}
      answers={currentUser.metadata.answers}
      gptAnalysis={currentUser.metadata.gptAnalysis}
    />
  );
};
