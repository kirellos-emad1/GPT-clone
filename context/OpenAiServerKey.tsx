import React from "react";
import OpenAIKeyProvider from "./OpenAiKey";

const OpenAIServerKeyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <OpenAIKeyProvider serverKey={process.env.AZURE_OPENAI_API_KEY ?? ""}>
        {children}
      </OpenAIKeyProvider>
    </>
  );
};

export default OpenAIServerKeyProvider;