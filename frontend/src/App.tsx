import { Typography } from "antd";

import { UserCreateForm } from "./components/Form/Form";
import { FORM_TITLE } from "./constants/text";

function App() {
  const { Title } = Typography;

  return (
    <>
      <Title level={3} style={{ textAlign: "center" }}>
        {FORM_TITLE}
      </Title>
      <UserCreateForm />
    </>
  );
}

export default App;
