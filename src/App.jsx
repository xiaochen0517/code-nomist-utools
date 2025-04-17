import {MainView} from "./view/MainView.jsx";
import {ConfigProvider, theme} from "antd";

export default function App() {

  return (
    <ConfigProvider
      theme={{
        // 1. 单独使用暗色算法
        algorithm: theme.darkAlgorithm,

        // 2. 组合使用暗色算法与紧凑算法
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <div className="App">
        <MainView/>
      </div>
    </ConfigProvider>
  );
}
