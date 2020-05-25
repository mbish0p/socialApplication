import React, { useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

const DropdownButton = (props) => {
  return (
    <nav className="settings-button">
      <ul className="settings-button-item">{props.children}</ul>
    </nav>
  );
};

const DropdownIcon = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </button>

      {open && props.children}
    </div>
  );
};

const DropdownMenu = (props) => {
  return (
    <div className="dropdown">
      <DropdownItem
        icon={<GrEdit />}
        eventHandler={(option) => {
          props.settingOption(option);
        }}
      >
        Edit
      </DropdownItem>
      <DropdownItem
        icon={<RiDeleteBin6Line />}
        eventHandler={(option) => {
          props.settingOption(option);
        }}
      >
        Delete
      </DropdownItem>
    </div>
  );
};

const DropdownItem = (props) => {
  return (
    <button
      href="#"
      className="menu-item"
      onClick={() => {
        props.eventHandler({
          option: props.children,
        });
      }}
    >
      <span className="icon-button">{props.icon}</span>
      {props.children}
    </button>
  );
};

export { DropdownButton, DropdownIcon, DropdownMenu };
