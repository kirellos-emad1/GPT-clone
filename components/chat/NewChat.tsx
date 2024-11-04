"use client";


const NewChat = () => {

  return (
    <div className="flex items-start justify-center flex-1 w-full h-full sm:items-center">
      {/* Container */}
      <div className="w-full max-h-full px-8 py-10 mx-8 rounded-md shadow-sm md:max-w-xl dark:bg-neutral-950/30 bg-white/50">
        <h2 className="text-lg font-medium">Start a New Chat</h2>
        <p className="mt-1 font-light dark:text-neutral-500">
          <span className="font-medium dark:text-neutral-400">
            ask your first question
          </span>{" "}
          to start a new chat.
        </p>
      </div>
    </div>
  );
};

export default NewChat;