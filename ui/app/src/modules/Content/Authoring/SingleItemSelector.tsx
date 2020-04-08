/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { palette } from '../../../styles/theme';
import { Variant } from '@material-ui/core/styles/createTypography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Item } from '../../../models/Item';

// TODO remove mockup data as component menu is implemented
const MENU_ITEMS = [
  {
    name: 'Style',
    internalName: 'Style',
    uri: '/site/website/style/index.xml'
  },
  {
    name: 'Health',
    internalName: 'Health',
    uri: '/site/website/health/index.xml'
  },
  {
    name: 'Technology',
    internalName: 'Technology',
    uri: '/site/website/technology/index.xml'
  },
  {
    name: 'Root path',
    internalName: 'Root',
    uri: '/'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    'backgroundColor': palette.white,
    'display': 'flex',
    'justifyContent': 'space-between',
    'padding': '10px 15px',
    '& p': {
      padding: 0
    }
  },
  textWrapper: {
    'display': 'flex',
    '& > *': {
      marginRight: 15
    },
    '& > p': {
      color: palette.black
    }
  },
  title: {
    fontWeight: 600
  },
  changeBtn: {
    padding: 0
  },
  labelIcon: {
    fill: palette.teal.main,
    marginRight: 10
  },
  editIcon: {
    fontSize: 17
  }
}));

interface NewContentSelectProps {
  LabelIcon: OverridableComponent<SvgIconTypeMap>;
  classes?: {
    root?: string;
    title?: string;
    editIcon?: string;
    labelIcon?: string;
  };
  selectItem: Item;
  label: string;
  titleVariant?: Variant;
  labelVariant?: Variant;

  onMenuItemClick(item: Item): any;

  onEditClick(): void;
}

export default function SingleItemSelector(props: NewContentSelectProps) {
  const {
    LabelIcon,
    classes: propClasses,
    titleVariant,
    labelVariant,
    onEditClick,
    selectItem,
    label,
    onMenuItemClick: onMenuItemClickProp
  } = props;
  const classes = useStyles();
  const [anchorEl, setanchorEl] = useState(null);

  const onMenuClose = () => setanchorEl(null);

  const onMenuItemClick = (item) => () => {
    onMenuItemClickProp(item);
    onMenuClose();
  };

  return (
    <Paper className={clsx(classes.root, propClasses?.root)} elevation={0}>
      <div className={classes.textWrapper}>
        <Typography
          variant={titleVariant || 'body1'}
          className={clsx(classes.title, propClasses?.title)}
        >
          {label}
        </Typography>
        <LabelIcon className={clsx(classes.labelIcon, propClasses?.labelIcon)} />
        <Typography variant={labelVariant || 'body1'}>{selectItem.internalName}</Typography>
      </div>
      <IconButton
        className={classes.changeBtn}
        onClick={(e) => {
          setanchorEl(e.currentTarget);
          onEditClick();
        }}
      >
        <EditIcon className={clsx(classes.editIcon, propClasses?.editIcon)} />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={onMenuClose}>
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.name} onClick={onMenuItemClick(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}