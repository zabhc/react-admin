import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Row, Col, Input, DatePicker, Spin, Cascader, Radio, Button } from 'antd';
import { AmtInput, DoublePwd, Email, MobilePhone, Name, Sex, UserId } from 'react-admin-components';
import { getFormItemLayout, getFormButtonLayout } from '@/utils/layout';
import { parseMomentObject } from '@/utils/parse';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

const C2I0Layout = getFormItemLayout(2, 0);
const C2I1Layout = getFormItemLayout(2, 1);
const C2I0E2Layout = getFormItemLayout(2, 0, 2);

class TwoColumnsInput extends PureComponent {
  componentWillMount() {
    const { dispatch, routeid } = this.props;
    dispatch({
      type: 'two-columns/init',
      routeid,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, routeid } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const parseBirthday = parseMomentObject(values.birthday, 'MM-DD-YYYY');
      dispatch({
        type: 'two-columns/submit',
        routeid,
        payload: { formValues: { ...values, parseBirthday } },
      });
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/'));
  };

  render() {
    const { form, routeid, twoColumns, initLoading, submitLoading } = this.props;
    const { formValues, cityValues } = twoColumns[routeid];
    const { getFieldDecorator } = form;

    return (
      <Spin spinning={submitLoading == null ? false : submitLoading}>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Row gutter={16}>
            <UserId
              columnLayout={2}
              columnIndex={0}
              form={form}
              required
              hasFeedback
              label="用户名"
              field="username"
              initialValue={formValues.username}
            />
          </Row>
          <Row gutter={16}>
            <DoublePwd
              columnLayout={2}
              columnIndex={0}
              form={form}
              required
              hasFeedback
              pwdLabel="密码"
              pwdField="password"
              confirmLabel="确认密码"
              confirmField="confirmPassword"
              min={3}
              max={10}
              pwdInitialValue={formValues.password}
              confirmInitialValue={formValues.confirmPassword}
            />
            <MobilePhone
              columnLayout={2}
              columnIndex={0}
              form={form}
              required
              hasFeedback
              label="手机号码"
              field="phone"
              initialValue={formValues.phone}
            />
            <Email
              columnLayout={2}
              columnIndex={1}
              form={form}
              required
              hasFeedback
              label="邮箱地址"
              field="email"
              initialValue={formValues.email}
            />
            <Name
              columnLayout={2}
              columnIndex={0}
              form={form}
              required
              hasFeedback
              label="姓名"
              field="actualName"
              initialValue={formValues.actualName}
            />
            <Sex
              columnLayout={2}
              columnIndex={1}
              form={form}
              required
              label="性别"
              field="sex"
              initialValue={formValues.sex}
            />
            <Col {...C2I0Layout}>
              <Form.Item label="出生日期">
                {getFieldDecorator('birthday', {
                  initialValue: formValues.birthday,
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: '请选择出生日期',
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col {...C2I1Layout}>
              <Spin spinning={initLoading == null ? false : initLoading}>
                <Form.Item label="所属城市">
                  {getFieldDecorator('city', {
                    initialValue: formValues.city,
                    validateFirst: true,
                    rules: [
                      {
                        type: 'array',
                        required: true,
                        message: '请选择所属城市',
                      },
                    ],
                  })(<Cascader showSearch options={cityValues} placeholder="请选择所属城市" />)}
                </Form.Item>
              </Spin>
            </Col>
            <AmtInput
              columnLayout={2}
              columnIndex={0}
              form={form}
              required={false}
              hasFeedback
              label="每月收入"
              field="income"
              min={500}
              max={50000}
              decimal={1}
              initialValue={formValues.income}
            />
          </Row>
          <Row gutter={16}>
            <Col {...C2I0E2Layout}>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  initialValue: formValues.remark,
                })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注信息" rows={4} />)}
              </Form.Item>
            </Col>
            <Col {...C2I0Layout}>
              <Form.Item label="提交结果">
                {getFieldDecorator('submitTestResult', {
                  initialValue: formValues.submitTestResult,
                })(
                  <RadioGroup>
                    <Radio value={0}>成功</Radio>
                    <Radio value={1}>失败</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            <Col {...getFormButtonLayout(2)} style={{ textAlign: 'right', marginTop: 32 }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  提交
                </Button>
                <Button style={{ marginLeft: 16 }} onClick={this.handleClose}>
                  关闭
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    twoColumns: state['two-columns'],
    initLoading: state.loading.effects['two-columns/init'],
    submitLoading: state.loading.effects['two-columns/submit'],
  };
}

export default connect(mapStateToProps)(Form.create()(TwoColumnsInput));
