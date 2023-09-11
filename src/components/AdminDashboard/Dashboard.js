import React, { useState, useEffect } from 'react';
import Header from "../Header/Header"
import Search from '../Search/Search';
import axios from "axios";
import Table from "../Table/Table";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [debounce, setDebounce] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [selectCheckbox, setSelectCheckbox] = useState([]);
  const [selectAllUser, setSelectAllUser] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUsers(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const rowsInPage = 10;
  const pages = Math.ceil(users.length / rowsInPage);
  const startIndex = (currentPage - 1) * rowsInPage;
  const endIndex = startIndex + rowsInPage;
  const rowsToShow = users.slice(startIndex, endIndex);

  const BackPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const FirstPage = () => {
    setCurrentPage(1);
  };

  const LastPage = () => {
    setCurrentPage(pages);
  };

  const NextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const showPageButtons = () => {
    const buttons = [];
    for (let page = 1; page <= pages; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          disabled={currentPage === page}
        >
          {page}
        </button>
      );
    }
    return buttons;
  };

  const debounceSearch = (event, debounceTimeout) => {
    setLoading(true);
    if (debounce) {
      clearTimeout(debounce);
    }
    const debounceCall = setTimeout(() => {
      const searchResult = users.filter((item) => {
        console.log(item.name.toLowerCase());
        return (
          item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.email.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.role.toLowerCase().includes(searchItem.toLowerCase())
        );
      });
      if (event.target.value === "") {
        setUsers(fetchUsers());
      }
      setUsers(searchResult);
    }, debounceTimeout);
    setDebounce(debounceCall);
    setLoading(false);
  };

  const search = (e) => {
    setSearchItem(e.target.value);
    debounceSearch(e, 500);
  };

  const handleDeleteUser = (userId) => {
    setLoading(true);
    setUsers((prevUser) => prevUser.filter((user) => user.id !== userId));
    setLoading(false);
  };

  const handleSelectUser = (userId) => {
    let arr;
    if (selectCheckbox.includes(userId)) {
      arr = selectCheckbox.filter((user) => {
        return user !== userId;
      });
    } else {
      arr = [...selectCheckbox, userId];
    }

    setSelectCheckbox(arr);
  };

  const deleteMultiple = () => {
    setLoading(true);
    setSelectAllUser(false);
    for (let i = 0; i < selectCheckbox.length; i++) {
      handleDeleteUser(selectCheckbox[i]);
    }
  };
  const selectAll = () => {
    if (selectCheckbox.length !== 10) {
      setSelectAllUser(true);
      setSelectCheckbox(
        rowsToShow.map((user) => {
          return user.id;
        })
      );
    } else {
      setSelectAllUser(false);
      setSelectCheckbox([]);
    }
    setLoading(false);
  };



  return (
    <div>
      <Header />
      <Search SearchText={search}/>
      <Box>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAllUser}
                  onClick={selectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ display: "flex", gap: "0.5vw" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Box position={"absolute"} top={"30vh"}>
                <CircularProgress variant="secondary" />
              </Box>
            ) : (
              rowsToShow.map((item) => {
                return (
                  <Table
                    user={item}
                    key={item.id}
                    checked={selectCheckbox.includes(item.id)}
                    selectUser={() => handleSelectUser(item.id)}
                    onDelete={() => handleDeleteUser(item.id)}
                  />
                );
              })
            )}
            {}
          </tbody>
        </table>
        <button className="button-selected"onClick={deleteMultiple} > 
        Delete selected
        </button>
        <div className="button-group">
          <button onClick={FirstPage} disabled={currentPage === 1}>
            {"<<"}
          </button>
          <button onClick={BackPage} disabled={currentPage === 1}>
            {"<"}
          </button>
          {showPageButtons()}
          <button onClick={NextPage} disabled={currentPage === pages}>
            {">"}
          </button>
          <button onClick={LastPage} disabled={currentPage === pages}>
            {">>"}
          </button>
        </div>
      </Box>
    </div>
  )
}

export default Dashboard
