const SendChatInputLayout: React.FC = () => {
  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray dark:bg-darkMessageBackground rounded-lg p-[10px]">
        <textarea
          className="bg-transparent border-none placeholder:text-textSecondary dark:placeholder:text-darkTextSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message and press Enter to send..."
          rows={1}
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInputLayout;
