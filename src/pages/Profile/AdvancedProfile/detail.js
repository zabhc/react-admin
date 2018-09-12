import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Spin, Table, Steps, Icon, Col, Button, Dropdown, Row, Menu, Badge } from 'antd';
import { DescriptionList } from 'ant-design-pro';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { thousandBitSeparator, isEmptyObject } from '@/utils/utils';
import { parseSexValue, parseDateTimeString, parseAmtUppercase } from '@/utils/parse';

const { Step } = Steps;
const ButtonGroup = Button.Group;
const { Description } = DescriptionList;

class AdvancedProfileDetail extends PureComponent {
  state = {
    expandTabKey: 'moneyFlow',
  };

  componentWillMount() {
    const { dispatch, routeid, approval } = this.props;
    const approvalNo = approval == null ? '201801110005' : approval.approvalNo;
    dispatch({
      type: 'advanced-profile/init',
      routeid,
      payload: {
        approvalNo,
      },
    });
  }

  handleTabChange = key => {
    this.setState({
      expandTabKey: key,
    });
  };

  handlePassClick = () => {
    const { dispatch, routeid, approval } = this.props;
    const approvalNo = approval == null ? '201801110005' : approval.approvalNo;
    dispatch({
      type: 'advanced-profile/pass',
      routeid,
      payload: {
        approvalNo,
      },
    });
  };

  handleNotPassClick = () => {
    const { dispatch, routeid, approval } = this.props;
    const approvalNo = approval == null ? '201801110005' : approval.approvalNo;
    dispatch({
      type: 'advanced-profile/notPass',
      routeid,
      payload: {
        approvalNo,
      },
    });
  };

  renderTransType = (transType) => {
    if (transType === 1) {
      return <Badge status="success" text="转入" />;
    }
    return <Badge status="processing" text="转出" />;
  }

  renderApprovalProgressStep(step) {
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    const { approvalProgress } = profileData;
    const { approver } = approvalProgress;
    if (approver[step] == null) {
      return null;
    }
    let style = {};
    if (step === approvalProgress.current) {
      style = { color: '#00A0E9', marginLeft: 8 };
    } else {
      style = { marginLeft: 8 };
    }

    return (
      <div>
        <div>
          {approver[step].name}
          <Icon type="dingding-o" style={style} />
        </div>
        <div>{approver[step].datetime}</div>
      </div>
    );
  }

  renderApprovalProgress() {
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    const { approvalProgress } = profileData;

    return (
      <Card title="信用卡审批进度" bordered={false} style={{ marginTop: 25, marginBottom: 24 }}>
        <Steps current={approvalProgress.current}>
          <Step title="信用评估" description={this.renderApprovalProgressStep(0)} />
          <Step title="财务初评" description={this.renderApprovalProgressStep(1)} />
          <Step title="财务复核" description={this.renderApprovalProgressStep(2)} />
          <Step title="完成" description={this.renderApprovalProgressStep(3)} />
        </Steps>
      </Card>
    );
  }

  renderBaiscInfo() {
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    return (
      <Card title="客户基本信息" bordered={false} style={{ marginBottom: 24 }}>
        <DescriptionList size="large">
          <Description term="用户名">{profileData.username}</Description>
          <Description term="手机号码">{profileData.phone}</Description>
          <Description term="邮箱地址">{profileData.email}</Description>
          <Description term="姓名">{profileData.actualName}</Description>
          <Description term="性别">{parseSexValue(profileData.sex)}</Description>
          <Description term="出生日期">
            {parseDateTimeString(profileData.parseBirthday, 'MM-DD-YYYY', 'YYYY年MM月DD日')}
          </Description>
          <Description term="所属城市">{profileData.city}</Description>
          <Description term="每月收入">{parseAmtUppercase(profileData.income)}</Description>
          <Description term="备注">{profileData.remark}</Description>
        </DescriptionList>
      </Card>
    );
  }

  renderMoneyFlows() {
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    const flowColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '交易日期',
        dataIndex: 'transDate',
        key: 'transDate',
      },
      {
        title: '交易时间',
        dataIndex: 'transTime',
        key: 'transTime',
      },
      {
        title: '交易类型',
        dataIndex: 'transType',
        key: 'transType',
        render: transType => this.renderTransType(transType),
      },
      {
        title: '交易金额',
        dataIndex: 'transAmt',
        key: 'transAmt',
        render: transAmt => parseAmtUppercase(transAmt),
      },
      {
        title: '对方行名',
        dataIndex: 'sideBank',
        key: 'sideBank',
      },
      {
        title: '对方户名',
        dataIndex: 'sideAcctName',
        key: 'sideAcctName',
      },
      {
        title: '交易摘要',
        dataIndex: 'transSummary',
        key: 'transSummary',
      },
    ];

    return (
      <Table
        pagination={{ pageSize: 5 }}
        columns={flowColumns}
        rowKey="id"
        dataSource={profileData.moneyFlows}
      />
    );
  }

  renderFamilyMembers() {
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    const familyColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        render: age => `${age}岁`,
      },
      {
        title: '关系',
        dataIndex: 'relationship',
        key: 'relationship',
      },
      {
        title: '工作单位',
        dataIndex: 'employer',
        key: 'employer',
        align: 'left',
      },
      {
        title: '职业',
        dataIndex: 'job',
        key: 'job',
      },
      {
        title: '身份证号码',
        dataIndex: 'idNumber',
        key: 'idNumber',
      },
    ];

    return (
      <Table
        pagination={false}
        columns={familyColumns}
        rowKey="id"
        dataSource={profileData.familyMembers}
      />
    );
  }

  renderExpandInfo() {
    const tabList = [
      {
        key: 'moneyFlow',
        tab: '资金流水',
      },
      {
        key: 'familyMember',
        tab: '家庭成员',
      },
    ];

    const contentList = {
      moneyFlow: this.renderMoneyFlows(),
      familyMember: this.renderFamilyMembers(),
    };
    const { expandTabKey } = this.state;
    return (
      <Card
        bordered={false}
        tabList={tabList}
        style={{ marginBottom: 24 }}
        onTabChange={this.handleTabChange}
      >
        {contentList[expandTabKey]}
      </Card>
    );
  }

  renderApproval() {
    const { approval, passLoading, notPassLoading } = this.props;
    const approvalNo = approval == null ? '201801110005' : approval.approvalNo;
    const { routeid, advancedProfile } = this.props;
    const { profileData } = advancedProfile[routeid];
    const { approvalBasic } = profileData;
    const menu = (
      <Menu>
        <Menu.Item key="1">其他操作一</Menu.Item>
        <Menu.Item key="2">其他操作二</Menu.Item>
        <Menu.Item key="3">其他操作三</Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Button onClick={this.handleNotPassClick} loading={notPassLoading}>
            不通过
          </Button>
          <Button>暂停</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handlePassClick} loading={passLoading}>
          通过
        </Button>
      </div>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={8}>
          <div>状态</div>
          <div style={{ color: '#262626', fontSize: 20 }}>{approvalBasic.status}</div>
        </Col>
        <Col xs={24} sm={16}>
          <div>申请额度</div>
          <div style={{ color: '#00A0E9', fontSize: 20 }}>
            {`¥ ${thousandBitSeparator(approvalBasic.appLimit)}`}
          </div>
        </Col>
      </Row>
    );
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="创建人">{approvalBasic.founder}</Description>
        <Description term="申请卡种">{approvalBasic.cardType}</Description>
        <Description term="创建时间">{approvalBasic.createDate}</Description>
        <Description term="关联资料">
          <a href="">{approvalBasic.related}</a>
        </Description>
        <Description term="备注">{approvalBasic.remark}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderWrapper
        title={`流程编号：${approvalNo}`}
        logo={<img alt="" src="/seno.png" />}
        action={action}
        content={description}
        extraContent={extra}
      >
        {this.renderApprovalProgress()}
        {this.renderBaiscInfo()}
        {this.renderExpandInfo()}
      </PageHeaderWrapper>
    );
  }

  render() {
    const { routeid, advancedProfile, approval, initLoading } = this.props;
    const { profileData } = advancedProfile[routeid];
    const approvalNo = approval == null ? '201801110005' : approval.approvalNo;

    if (isEmptyObject(profileData)) {
      return (
        <Spin spinning={initLoading == null ? false : initLoading}>
          <PageHeaderWrapper
            title={`流程编号：${approvalNo}`}
            logo={<img alt="" src="/seno.png" />}
          />
        </Spin>
      );
    }
    return <div>{this.renderApproval()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    approval: state.public.approval,
    advancedProfile: state['advanced-profile'],
    initLoading: state.loading.effects['advanced-profile/init'],
    passLoading: state.loading.effects['advanced-profile/pass'],
    notPassLoading: state.loading.effects['advanced-profile/notPass'],
  };
}

export default connect(mapStateToProps)(AdvancedProfileDetail);
