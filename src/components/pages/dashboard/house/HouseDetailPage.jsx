import React, { Component } from 'react';
import { SideBar, HeaderLayout, FooterLayout } from '../../../layouts/dashboard';
import { HeaderComponent, CardResposComponent, FormComponent, DetailComponent, LoadingComponent } from '../../../shared/dashboard';
import { requestExistToken, requestLogout } from '../../../../actions/login';
import { connect } from 'react-redux';
import { requestGetHouse } from '../../../../actions/house';
import { requestHouseDetail, requestDeleteHouseDetail, requestAddHouseDetail, requestUpdateHouseDetail } from '../../../../actions/housedetail';
import { Pagination } from '../../../function';
import { Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loadjs from 'loadjs';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class HouseDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: 'VIEW_CARD',
            edit: false,
            dataEdit: {},
            pageOfItems: []
        }
        this.switchViews = this.switchViews.bind(this);
        this.onChangerAdd = this.onChangerAdd.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }
    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }
    componentDidMount() {
        loadjs('/script/script.min.js', function () {
        });
        this.props.requestGetHouse();
        this.props.requestHouseDetail();

    }
    switchViews(view) {
        this.setState({
            views: view
        })
    }
    onChangerAdd() {
        this.setState({
            views: 'VIEW_FORM'
        })
    }
    onLogout() {
        this.props.requestLogout();
    }
    onDelete(id) {
        this.props.requestDeleteHouseDetail(id);
    }
    onAdd(data) {
        this.props.requestAddHouseDetail(data);
        this.setState({
            views: 'VIEW_CARD'
        })
    }
    onEdit(data) {
        this.setState({
            views: 'VIEW_FORM'
        })
        let item = [...this.props.data].filter(item => item.id === data)
        if (item.length > 0) {
            this.setState({
                dataEdit: item[0],
                edit: true
            })
        }

    }
    onUpdate(data) {
        this.props.requestUpdateHouseDetail(data);
        this.setState({
            views: "VIEW_CARD"
        })
    }
    render() {
        if (typeof (cookies.get('token')) === 'undefined' && this.props.exists === false) {
            return (
                <Redirect to="/login" />
            )
        }
        const loading = () => {
            if (this.props.fetching) {
                return (
                    <LoadingComponent></LoadingComponent>
                )
            }
        }
        const MainContent = () => {
            switch (this.state.views) {
                case 'VIEW_CARD':
                    return (
                        <section className="b-page-respos">
                            <div className="b-fix-add">
                                <button className="b-btn" onClick={this.onChangerAdd}>
                                    <i className="fas fa-plus-circle"></i>
                                </button>
                            </div>
                            <div className="container-fluid">
                                <div className="b-respos">
                                    <div className="row">
                                        <div className="col-lg-6 offset-lg-3">
                                            <div className="b-heading text-center wow fadeInDown">
                                                <h2 className="b-text-title">
                                                    House Details
                                        </h2>
                                                <p className="b-text-norm">
                                                    User service easy to use
                                        </p>
                                            </div>
                                        </div>
                                    </div>
                                    {loading()}
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <table className="b-table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Place</th>
                                                        <th>Title</th>
                                                        <th>Body</th>
                                                        <th>Edit</th>
                                                        <th>Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.pageOfItems.map(data => (
                                                        <CardResposComponent key={data.id} onDelete={this.onDelete} data={data} onEdit={this.onEdit} onDetail={this.onDetail} switchViews={this.switchViews} choice="HOUSE_DETAIL"></CardResposComponent>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <Pagination items={this.props.data} onChangePage={this.onChangePage} />
                                </div>
                            </div>
                        </section>
                    )
                case 'VIEW_FORM':
                    return (
                        <FormComponent choice="HOUSE_DETAIL" switchViews={this.switchViews} house={this.props.house} onAdd={this.onAdd} dataEdit={this.state.dataEdit} edit={this.state.edit} onUpdate={this.onUpdate}></FormComponent>
                    )
                case 'VIEW_DETAIL':
                    return (
                        <DetailComponent ></DetailComponent>
                    )
                default:
                    return (
                        <FormComponent ></FormComponent>
                    )
            }
        }
        return (
            <div className="b-wrapper">
                <ToastContainer autoClose={5000} draggable={false} />
                <HeaderLayout></HeaderLayout>
                <main className="b-dashboard-main">
                    <div className="b-dashboard">
                        <div className="b-block-left">
                            <SideBar onLogout={this.onLogout}></SideBar>
                        </div>
                        <div className="b-block-right">
                            <HeaderComponent title="Place"></HeaderComponent>
                            {MainContent()}
                            <FooterLayout></FooterLayout>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        house: state.house.all,
        data: state.housedetail.all,
        fetching: state.housedetail.fetching,
        detail: state.housedetail.detail,
        exists: state.login.exists
    }
}
export default connect(mapStateToProps, { requestUpdateHouseDetail, requestAddHouseDetail, requestDeleteHouseDetail, requestHouseDetail, requestGetHouse, requestExistToken, requestLogout })(HouseDetailPage);