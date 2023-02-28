import { Menu, MenuItem } from "@material-ui/core";
import { MENU_ITEMS } from "src/utils/constants/data-management-dashboard";
import { grey } from "@material-ui/core/colors";

function Selection(props: any) {
  return (
    <Menu
      anchorEl={props.anchorEl}
      keepMounted
      open={Boolean(props.anchorEl)}
      onClose={() => props.onAnchorEl(null)}
    >
      {MENU_ITEMS["coverage"].map((el: any) => (
        <MenuItem
          id={el.id}
          key={el.id}
          onClick= {props.selected.includes(el.id) ? () => null : () => props.onSelected(el.id)}
          style={{ backgroundColor: props.selected.includes(el.id) ? grey[300] : "", color: props.selected.includes(el.id) ? grey[400] : "" }}
        >
          {el.name}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default Selection;
