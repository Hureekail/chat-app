import ButtomTabs from "../components/ui/ButtomTabs";

const isMobile = window.innerWidth <= 640;

const Chats = () => {
  if (isMobile) {
    return (
      <div>
        <div className="fixed bottom-0 left-0 w-full flex justify-center">
          <ButtomTabs />
        </div>
      </div>
    )
  }
  return (
  <div>
    <div className="flex mt-50">
        <ButtomTabs />
    </div>
  </div>
)
}

export default Chats;