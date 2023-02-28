import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import { Typography, IconButton } from '@material-ui/core';
import { Input } from '@material-ui/icons';
import {
  fade,
  withStyles,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring'; // web.cjs is required for IE 11 support
import { TransitionProps } from '@material-ui/core/transitions';
import { Button } from 'devextreme-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type StyledTreeItemProps = TreeItemProps & {
  labelText: string;
  nodeId: string;
  isRowEvent?: boolean;
  labelIcon?: React.ElementType<SvgIconProps>;
  onClick?: (event, nodeId) => void;
  onRowClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1
  },
  labelIcon: {
    fontWeight: 'inherit', //theme.typography.fontWeightLight,
    fontSize: theme.typography.pxToRem(15)
  },
  btn: {
    padding: 0
  },
  relationIcon: {
    padding: '0.5px',
    margin: '0.5px 1.5px',
    borderRadius: '50%'
  },
  onHoldRelationIcon: {
    padding: '0.5px',
    margin: '0.5px 1.5px',
    borderRadius: '50%',
    backgroundColor: 'black',
    color: 'white'
  }
}));

export const MinusSquare = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};

export const PlusSquare = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
};

export const InputDownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M3858 6423 l-3 -1178 -317 -3 c-175 -1 -318 -4 -318 -6 0 -4 165 -294 180 -316 5 -8 23 -40 40 -70 16 -30 41 -73 55 -95 13 -22 33 -56 43 -75 21 -38 83 -147 113 -195 10 -16 41 -70 69 -120 28 -49 61 -108 75 -130 14 -22 28 -47 32 -55 9 -16 131 -230 148 -258 6 -9 31 -52 55 -95 25 -44 55 -95 67 -115 12 -21 26 -44 30 -52 9 -17 89 -158 103 -180 5 -8 35 -60 66 -115 32 -55 61 -104 65 -108 4 -5 42 53 85 130 44 76 83 145 89 154 5 9 34 59 63 110 29 52 64 112 77 134 13 22 48 82 77 133 29 51 63 110 75 130 13 20 26 44 30 52 28 54 89 157 100 168 7 7 13 17 13 21 0 7 82 150 120 211 5 8 32 56 60 105 28 50 61 108 75 130 13 22 47 81 75 130 28 50 61 108 75 130 13 22 38 65 55 95 49 89 67 119 80 135 11 13 -26 15 -316 17 l-329 3 -3 1178 -2 1177 -500 0 -500 0 -2 -1177z"/>
        <path d="M1440 3420 l0 -2030 2925 0 2925 0 0 2030 0 2030 -505 0 -505 0 0 -1530 0 -1530 -1912 2 -1913 3 -3 1528 -2 1527 -505 0 -505 0 0 -2030z"/>
      </g>
    </SvgIcon>
  )
}

export const OutputDownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M1420 5070 l0 -2030 500 0 500 0 0 1525 0 1525 1915 0 1915 0 0 -1525 0 -1525 505 0 505 0 0 2030 0 2030 -2920 0 -2920 0 0 -2030z"/>
        <path d="M3840 4060 l0 -1180 -325 0 c-179 0 -325 -2 -325 -4 0 -3 442 -769 655 -1136 92 -158 192 -331 280 -485 34 -60 72 -126 83 -145 12 -19 44 -76 73 -127 29 -51 56 -90 60 -87 4 2 14 17 22 32 8 15 31 56 52 92 21 36 46 81 57 100 10 19 28 51 39 70 12 19 58 98 102 175 44 77 101 175 126 218 58 100 50 85 268 462 101 176 188 327 193 335 21 36 219 380 248 431 18 31 32 59 32 63 0 3 -143 7 -317 8 l-318 3 -3 1178 -2 1177 -500 0 -500 0 0 -1180z"/>
      </g>
    </SvgIcon>
  )
}

export const InputUpIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M1350 5220 l0 -2030 505 0 505 0 0 1530 0 1530 1913 -2 1912 -3 3 -1527 2 -1528 505 0 505 0 0 2030 0 2030 -2925 0 -2925 0 0 -2030z"/>
        <path d="M4194 5253 c-44 -76 -83 -145 -89 -154 -5 -9 -34 -59 -63 -110 -29 -52 -64 -112 -77 -134 -13 -22 -48 -82 -77 -133 -29 -51 -63 -110 -75 -130 -13 -20 -26 -44 -30 -52 -28 -54 -89 -157 -100 -168 -7 -7 -13 -17 -13 -21 0 -7 -82 -150 -120 -211 -5 -8 -32 -55 -60 -105 -28 -49 -61 -108 -75 -130 -13 -22 -47 -80 -75 -130 -28 -49 -61 -108 -75 -130 -13 -22 -38 -65 -55 -95 -49 -89 -67 -119 -80 -135 -11 -13 26 -15 316 -17 l329 -3 3 -1177 2 -1178 500 0 500 0 2 1178 3 1177 318 3 c174 1 317 4 317 6 0 4 -165 294 -180 316 -5 8 -23 40 -40 70 -16 30 -41 73 -55 95 -13 22 -33 56 -43 75 -21 38 -83 147 -113 195 -10 17 -41 71 -69 120 -28 50 -61 108 -75 130 -14 22 -28 47 -32 55 -9 16 -131 230 -148 258 -6 9 -31 52 -55 95 -25 44 -55 95 -67 115 -12 21 -26 44 -30 52 -9 17 -89 158 -103 180 -5 8 -35 60 -66 115 -32 55 -61 104 -65 108 -4 5 -42 -53 -85 -130z"/>
      </g>
    </SvgIcon>
  )
}

export const OutputUpIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M4294 7738 c-5 -7 -14 -22 -20 -33 -6 -11 -28 -49 -49 -85 -21 -36 -46 -81 -57 -100 -10 -19 -28 -51 -39 -70 -12 -19 -58 -98 -102 -175 -44 -77 -101 -175 -126 -218 -58 -100 -50 -85 -268 -462 -101 -176 -188 -327 -193 -335 -21 -36 -219 -380 -248 -431 -18 -31 -32 -59 -32 -63 0 -3 143 -7 318 -8 l317 -3 3 -1177 2 -1178 500 0 500 0 0 1180 0 1180 325 0 c179 0 325 2 325 4 0 3 -442 769 -655 1136 -92 158 -192 331 -280 485 -34 61 -72 126 -83 145 -12 19 -40 69 -63 110 -61 109 -65 114 -75 98z"/>
        <path d="M1380 3570 l0 -2030 2920 0 2920 0 0 2030 0 2030 -500 0 -500 0 0 -1525 0 -1525 -1915 0 -1915 0 0 1525 0 1525 -505 0 -505 0 0 -2030z"/>
      </g>
    </SvgIcon>
  )
}

const TransitionComponent = (props: TransitionProps) => {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
    }
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};

export const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3
      }
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`
    }
  })
)((props: StyledTreeItemProps & { relations?: string[], onRelationCLick?: Function, onRelationEject?: Function, relationHoldID?: number }) => {
  const {
    nodeId,
    labelText,
    labelIcon: LabelIcon,
    isRowEvent,
    onClick,
    onRowClick,
    relations,
    onRelationCLick,
    onRelationEject,
    relationHoldID,
    ...rest
  } = props;
  const classes = useStyles();

  const iconElements = (relations || []).map((relation, index) => {
    const properties = relation.split('_')
    if (properties[1] === 'output') {
      if (properties[0] === 'down') {
        return <OutputDownIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
      }
      if (properties[0] === 'up') {
        return <OutputUpIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
      }
    }
    if (properties[1] === 'input') {
      if (properties[0] === 'down') {
        return <InputDownIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
      }
      if (properties[0] === 'up') {
        return <InputUpIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
      }
    }
  })

  return (
    <TreeItem
      nodeId={nodeId}
      label={
        <>
          {!LabelIcon ? (
            <>
              {isRowEvent ? (
                <div className={classes.root} onClick={() => onRowClick()}>
                  <Typography variant="body2" className={classes.labelText}>
                    {props.labelText}
                    {iconElements}
                  </Typography>
                </div>
              ) : (
                <div className={classes.root}>
                  <Typography variant="body2" className={classes.labelText}>
                    {props.labelText}
                    {iconElements}
                  </Typography>
                </div>
              )}
            </>
          ) : (
            <div className={classes.root}>
              <Typography variant="body2" className={classes.labelText}>
                {props.labelText}
                {iconElements}
              </Typography>
              <IconButton
                className={classes.btn}
                onClick={(event) => onClick(event, nodeId)}
              >
                <LabelIcon color="inherit" className={classes.labelIcon} />
              </IconButton>
            </div>
          )}
        </>
      }
      TransitionComponent={TransitionComponent}
      {...rest}
    />
  );
});
