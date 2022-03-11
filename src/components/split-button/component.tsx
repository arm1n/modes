import { Fragment, useState, useRef } from "react";
import type { FC } from "react";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

type Option = {
  label: string;
  handler: () => void;
};

type Props = {
  options: Option[];
};

export const Component: FC<Props> = ({ options }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedOption = options[selectedIndex];

  const clickButtonHandler = () => {
    selectedOption.handler();
  };

  const clickMenuItemHandler = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const clickToggleHandler = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const clickCloseHandler = (event: Event) => {
    const target = event.target as HTMLElement;
    const { current: anchor } = anchorRef;

    if (anchor?.contains(target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonGroup ref={anchorRef} variant="contained" color="secondary" disableElevation={true}>
        <Button onClick={clickButtonHandler}>{selectedOption.label}</Button>
        <Button size="small" onClick={clickToggleHandler}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        role={undefined}
        transition={true}
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={clickCloseHandler}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={() => clickMenuItemHandler(index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};
