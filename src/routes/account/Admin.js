import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import AdminList from '../../components/account/admin/List'
import AdminSearch from '../../components/account/admin/Search'
import AdminModal from '../../components/account/admin/ModalForm'
import {checkPower} from '../../utils'
import {ADD, UPDATE, DELETE} from '../../constants/options'

function Admin({location, curPowers, dispatch, accountAdmin, modal, loading}) {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const {field, keyword} = location.query

  const searchProps = {
    field,
    keyword,
    addPower,
    onSearch(fieldsValue) {
      const {pathname} = location
      !!fieldsValue.keyword.length
        ? dispatch(routerRedux.push({
          pathname: pathname,
          query: {
            ...fieldsValue
          }
        }))
        : dispatch(routerRedux.push({pathname: pathname}))
    },
    onAdd() {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          type: 'create'
        }
      })
    }
  }

  const listProps = {
    accountAdmin,
    loading,
    updatePower,
    deletePower,
    location,
    onPageChange(page) {
      const {query, pathname} = location
      dispatch(routerRedux.push({
        pathname: pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({type: 'accountAdmin/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onStatusItem(item) {
      dispatch({
        type: 'accountAdmin/updateStatus',
        payload: {
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    loading,
    onOk(data) {
      dispatch({
        type: !!data.id
          ? 'accountAdmin/update'
          : 'accountAdmin/create',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    }
  }

  return (
    <div className='content-inner'>
      <AdminSearch {...searchProps}/>
      <AdminList {...listProps}/>
      <AdminModal {...modalProps}/>
    </div>
  )
}

function mapStateToProps({ accountAdmin, modal, loading }) {
  return { accountAdmin, modal, loading: loading.models.accountAdmin }
}

export default connect(mapStateToProps)(Admin)
