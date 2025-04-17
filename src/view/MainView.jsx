import {Button, Form, Input, InputNumber, List, Select} from "antd";
import {useRef, useState} from "react";
import {generateText} from "ai";
import {createOllama} from "ollama-ai-provider";
import {CopyOutlined} from "@ant-design/icons";

const defaultFormValues = {
  name: "在线教育平台",
  description: "在线教育平台是一个提供在线学习和教学服务的网站或应用程序，用户可以通过它访问各种课程、学习资源和教师支持。",
  moduleName: "课程管理",
  targetType: "类名",
  formatType: "驼峰命名（首字母大写）",
  targetDescription: "课程目录实体类 + DO",
  targetCount: 5,
};

export function MainView() {
  const formRef = useRef(null);

  const [nameList, setNameList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const createUserContent = (name, introduce, module, target_type, format_type, target_desc, num) => {
    return `项目类型：${name}；项目介绍：${introduce}；` +
      `当前模块：${module}；目标名称类型：${target_type}；` +
      `格式化类型：${format_type}；目标描述：${target_desc}；生成数量：${num}；`;
  };

  const handleFinish = (values) => {
    setLoadingStatus(true);
    console.log("Received values:", values);
    let userContent = "";
    try {
      setNameList([]);
      userContent = createUserContent(
        values.name,
        values.description,
        values.moduleName,
        values.targetType,
        values.formatType,
        values.targetDescription,
        values.targetCount,
      );
    } catch (e) {
      console.log("Error:", e);
      setLoadingStatus(false);
      utools.showNotification("生成失败，请检查输入内容");
      return;
    }
    generateName(userContent);
  };

  const generateName = async (userContent) => {
    try {
      const ollama = createOllama({
        baseURL: "http://localhost:11434/api",
      });
      const {text} = await generateText({
        model: ollama("hf.co/MoChenYa/CodeNomist-Qwen2.5-7B-Instruct-unsloth:Q8_0"),
        messages: [
          {
            role: "system",
            content: "请充当一个代码命名助手，请根据用户给出的项目信息和具体需求生成多个命名建议，名称之间使用 | 分隔，注意不要生成其他任何内容。",
          },
          {role: "user", content: userContent},
        ],
      });
      console.log("Response:", text);
      const names = text.split("|")
        .map(item => item.trim());
      setNameList(names);
      utools.showNotification("生成成功");
    } catch (e) {
      console.log("Error:", e);
      utools.showNotification("生成失败，请检查输入内容");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handelCopy = (item) => {
    if (utools.copyText(item)) {
      utools.showNotification("复制成功");
      return;
    }
    utools.showNotification("复制失败");
  };

  return (
    <div className="w-full h-screen">
      <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto">
        <div className="w-full py-4 flex flex-col items-center justify-center">
          <div className="text-2xl" style={{color: "white"}}>编程命名助手</div>
          <div className="max-w-[40rem] w-full">
            <Form
              ref={formRef}
              layout="vertical"
              requiredMark="optional"
              initialValues={defaultFormValues}
              onFinish={handleFinish}
            >
              <Form.Item
                name="name"
                label="项目名称（类型）"
                rules={[
                  {required: true, message: "请输入项目名称（类型）"},
                  {max: 20, min: 2, message: "项目名称（类型）长度在2-20个字符之间"},
                ]}
                required
              >
                <Input placeholder="请输入项目名称（类型）"/>
              </Form.Item>
              <Form.Item
                name="description"
                label="项目介绍"
                tooltip="项目的简短介绍"
                rules={[
                  {required: true, message: "请输入项目介绍"},
                  {max: 100, min: 2, message: "项目介绍长度在2-100个字符之间"},
                ]}
                required
              >
                <Input placeholder="请输入项目介绍"/>
              </Form.Item>
              <Form.Item
                name="moduleName"
                label="模块名称"
                rules={[
                  {required: true, message: "请输入当前模块名称"},
                  {max: 20, min: 2, message: "当前模块名称长度在2-20个字符之间"},
                ]}
                required
              >
                <Input placeholder="请输入当前模块名称"/>
              </Form.Item>
              <Form.Item
                name="targetType"
                label="生成目标类型"
                rules={[{required: true, message: "请选择生成目标类型"}]}
                required
              >
                <Select placeholder="请选择生成目标类型">
                  <Select.Option value="模块名">模块名</Select.Option>
                  <Select.Option value="类名">类名</Select.Option>
                  <Select.Option value="函数（方法）名">函数（方法）名</Select.Option>
                  <Select.Option value="变量名">变量名</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="formatType"
                label="格式类型"
                rules={[{required: true, message: "请选择格式类型"}]}
                required
              >
                <Select placeholder="请选择生成格式类型">
                  <Select.Option value="驼峰命名（首字母小写）">驼峰命名（首字母小写）</Select.Option>
                  <Select.Option value="驼峰命名（首字母大写）">驼峰命名（首字母大写）</Select.Option>
                  <Select.Option value="下划线命名">下划线命名</Select.Option>
                  <Select.Option value="横线命名">横线命名</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="targetDescription"
                label="目标描述"
                rules={[
                  {required: true, message: "请输入目标描述"},
                  {max: 20, min: 2, message: "目标描述长度在2-20个字符之间"},
                ]}
                required
              >
                <Input placeholder="请输入目标描述"/>
              </Form.Item>
              <Form.Item
                name="targetCount"
                label="生成数量"
                rules={[{required: true, message: "请输入生成数量"}]}
                required
              >
                <InputNumber max={10} min={1}/>
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={loadingStatus}>生 成</Button>
              </Form.Item>
            </Form>
            <List
              className="border rounded-md border-neutral-700"
              style={{borderColor: "#404040"}}
              dataSource={nameList}
              renderItem={item => (
                <List.Item>
                  <div className="px-4 w-full flex justify-between">
                    <div>{item}</div>
                    <div className="cursor-pointer" onClick={() => handelCopy(item)}>
                      <CopyOutlined/>
                    </div>
                  </div>
                </List.Item>
              )}
            >
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}
