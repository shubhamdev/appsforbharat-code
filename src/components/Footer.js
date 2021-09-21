import React from "react";

function Footer({ data }) {
  return (
    <div className="footer">
      {data?.length ? <div>Total Item: {data?.length}</div> : "No data found"}
    </div>
  );
}

export default Footer;
