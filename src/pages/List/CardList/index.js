import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Radio, Input, List, Menu, Dropdown, Icon, Progress, Spin } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import { parseDateTimeString } from '@/utils/parse';
import { createRouteid } from '@/utils/utils';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

class CardList extends PureComponent {
  state = {
    routeid: createRouteid(),
    pagination: {
      current: 1,
      pageSize: 6,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, pageSize) => this.handlePageChange(page, pageSize),
      onShowSizeChange: (current, size) => this.handlePageShowSizeChange(current, size),
    },
    searchParams: {
      type: 1,
    },
  };

  componentWillMount() {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const { pagination, searchParams } = this.state;
    const params = this.createListParams(pagination, searchParams);
    dispatch({
      type: 'card-list/createState',
      routeid,
    });
    dispatch({
      type: 'card-list/init',
      routeid,
      payload: { params },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card-list/clearState',
    });
  }

  createListParams = (pagination, searchParams) => {
    const pageSize = pagination.pageSize == null ? 6 : pagination.pageSize;
    const params = {
      pageSize,
      current: pagination.current,
      ...searchParams,
    };
    return params;
  };

  handlePageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const { pagination, searchParams } = this.state;
    const newPagination = {
      ...pagination,
      current: page,
      pageSize,
    };
    this.setState({
      pagination: newPagination,
    });
    const params = this.createListParams(newPagination, searchParams);
    dispatch({
      type: 'card-list/get',
      routeid,
      payload: { params },
    });
  };

  handleTypeChange = event => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const { pagination, searchParams } = this.state;
    const type = event.target.value;
    let newSearchParams = null;
    if (type === '3') {
      newSearchParams = {
        ...searchParams,
        type: 1,
        highPriority: 1,
      };
    } else {
      newSearchParams = {
        ...searchParams,
        type,
        highPriority: null,
      };
    }
    const newPagination = {
      ...pagination,
      current: 1,
    };
    this.setState({
      pagination: newPagination,
      searchParams: newSearchParams,
    });
    const params = this.createListParams(newPagination, newSearchParams);
    dispatch({
      type: 'card-list/get',
      routeid,
      payload: { params },
    });
  };

  handleSearch = value => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const { pagination, searchParams } = this.state;
    const newSearchParams = {
      ...searchParams,
      approvalNo: value === '' ? null : value,
    };
    const newPagination = {
      ...pagination,
      current: 1,
    };
    this.setState({
      pagination: newPagination,
      searchParams: newSearchParams,
    });
    const params = this.createListParams(newPagination, newSearchParams);
    dispatch({
      type: 'card-list/get',
      routeid,
      payload: { params },
    });
  };

  handlePageShowSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const { pagination, searchParams } = this.state;
    const newPagination = {
      ...pagination,
      current,
      pageSize: size,
    };
    this.setState({
      pagination: newPagination,
    });
    const params = this.createListParams(newPagination, searchParams);
    dispatch({
      type: 'card-list/get',
      routeid,
      payload: { params },
    });
  };

  handleApproved = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card-list/approved',
      payload: {
        approval: {
          approvalNo: item.approvalNo,
          goBackRoute: '/list/card-list',
        },
      },
    });
  };

  renderHeader = () => {
    const { cardList, initLoading } = this.props;
    const { routeid } = this.state;

    if (cardList[routeid] == null) {
      return;
    }
    const { headerData } = cardList[routeid];

    const { pending, highPriority, completed } = headerData;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <Card bordered={false}>
        <Spin spinning={initLoading == null ? false : initLoading}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="我的待审批任务" value={`${pending}个任务`} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="高优先级审批任务" value={`${highPriority}个任务`} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="本周完成的审批任务" value={`${completed}个任务`} />
            </Col>
          </Row>
        </Spin>
      </Card>
    );
  };

  renderListCard = () => {
    const extraContent = (
      <div>
        <RadioGroup defaultValue="1" onChange={this.handleTypeChange}>
          <RadioButton value="1">待审批</RadioButton>
          <RadioButton value="3">高优先级</RadioButton>
          <RadioButton value="2">已完成</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={this.handleSearch}
        />
      </div>
    );
    return (
      <Card
        className={styles.listCard}
        bordered={false}
        title="卡片列表"
        style={{ marginTop: 24 }}
        bodyStyle={{ padding: '0 32px 40px 32px' }}
        extra={extraContent}
      >
        {this.renderList()}
      </Card>
    );
  };

  renderList = () => {
    const { cardList, listLoading } = this.props;
    const { pagination, searchParams, routeid } = this.state;

    if (cardList[routeid] == null) {
      return;
    }
    const { listData, total } = cardList[routeid];

    const menu = (
      <Menu>
        <Menu.Item>
          <a>操作一</a>
        </Menu.Item>
        <Menu.Item>
          <a>操作二</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <div className={styles.list}>
        <List
          rowKey="id"
          loading={listLoading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          pagination={{ ...pagination, total }}
          dataSource={listData}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                className={styles.card}
                actions={[
                  searchParams.type === '2' ? (
                    <a>查看</a>
                  ) : (
                    <a onClick={() => this.handleApproved(item)}>审批</a>
                  ),
                  <MoreBtn />,
                ]}
              >
                <Card.Meta
                  avatar={<img alt="" className={styles.cardAvatar} src={item.logo} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={
                    <Ellipsis className={styles.item}>
                      {
                        <div>
                          <div>{item.description}</div>
                          <div>
                            <span>开始时间：</span>
                            {parseDateTimeString(item.createdAt, 'YYYY-MM-DD', 'YYYY-MM-DD hh:mm')}
                          </div>
                          <div>
                            <span>提交员工：</span>
                            {item.submitter}
                          </div>
                          <div>
                            <span>审批进度：</span>
                            <Progress percent={item.percent} status={item.status} strokeWidth={6} />
                          </div>
                        </div>
                      }
                    </Ellipsis>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  };

  render() {
    return (
      <div className={styles.cardList}>
        {this.renderHeader()}
        {this.renderListCard()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cardList: state['card-list'],
    initLoading: state.loading.effects['card-list/init'],
    listLoading: state.loading.effects['card-list/get'],
  };
}

export default connect(mapStateToProps)(CardList);
