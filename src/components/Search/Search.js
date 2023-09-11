import React from "react";

const Search = ({ SearchText }) => {
  const searchUpdate = (ele) => {
    SearchText(ele);
  };
  return (
    <div className="searchBar">
      <input
        placeholder="Search by Name, Email or Role !"
        onChange={searchUpdate}
      />
    </div>
  );
};

export default Search;
