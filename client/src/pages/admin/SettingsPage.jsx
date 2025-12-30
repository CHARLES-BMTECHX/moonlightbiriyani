import { Typography, Form, Input, Button, Switch } from 'antd';

const { Title } = Typography;

const SettingsPage = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    alert('Settings Saved!');
  };

  return (
    <div>
      <Title level={2}>System Settings</Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Site Title" name="siteTitle" rules={[{ required: true, message: 'Please input site title!' }]}>
          <Input placeholder="My Admin Panel" />
        </Form.Item>

        <Form.Item label="Admin Email" name="adminEmail" rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}>
          <Input placeholder="admin@example.com" />
        </Form.Item>

        <Form.Item label="Enable Notifications" name="notifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsPage;
