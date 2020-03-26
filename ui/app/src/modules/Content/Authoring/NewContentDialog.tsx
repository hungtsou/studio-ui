/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import { palette } from '../../../styles/theme';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { fetchLegacyContentTypes } from '../../../services/content';
import DialogHeader from '../../../components/DialogHeader';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import NewContentCard from './NewContentCard';
import NewContentSelect from './NewContentSelect';

const translations = defineMessages({
  title: {
    id: 'newContentDialog.title',
    defaultMessage: 'Create Content'
  },
  subtitle: {
    id: 'newContentDialog.subtitle',
    defaultMessage: 'Choose a content type template for your new content item.'
  },
  previewImage: {
    id: 'previewImage.alt',
    defaultMessage: 'preview'
  }
});


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogActions: {
      padding: '10px 22px'
    },
    dialogContent: {
      padding: theme.spacing(2),
      backgroundColor: palette.gray.light0
    },
    prevImg: {
      maxWidth: '150px'
    },
    cardsContainer: {
      marginTop: 14
    }
  })
);


interface NewContentDialogProps {
  open: boolean;
  path: string;
  site: string;

  onDialogClose(): void;

  onTypeOpen(srcData: any, srcPath: string): any;
}

export default function NewContentDialog(props: NewContentDialogProps) {
  const { open, onDialogClose, onTypeOpen, site, path } = props;
  const { formatMessage } = useIntl();
  const classes = useStyles({});
  const defaultPath = '/site/website';
  const [contextPath, setContextPath] = useState(`${defaultPath}/`);
  const [selectContent, setSelectContent] = useState(null);
  const [contentTypes, setContentTypes] = useState(null);
  const contentTypesUrl = `/studio/api/1/services/api/1/content/get-content-at-path.bin?site=${site}&path=/config/studio/content-types`;
  const defaultPrevImgUrl = '/studio/static-assets/themes/cstudioTheme/images/default-contentType.jpg';

  const onListItemClick = (contentData) => () => setSelectContent(contentData);

  const getPrevImg = (content) =>
    (content?.imageThumbnail) ?
      `${contentTypesUrl}${content.form}/${content.imageThumbnail}` :
      defaultPrevImgUrl;

  useEffect(() => {
    setContextPath(`${defaultPath}${!path ? '/' : path}`);
  }, [path]);

  useEffect(() => {
    open && fetchLegacyContentTypes(site, contextPath).subscribe(data => {
      setContentTypes(data);
      setSelectContent(data[0]);
    });
  }, [open, contextPath, site]);

  return (
    contentTypes &&
    <Dialog
      open={open}
      onClose={onDialogClose}
      disableBackdropClick={true}
      fullWidth
      maxWidth={'md'}
    >
      <DialogHeader
        title={formatMessage(translations.title)}
        subtitle={formatMessage(translations.subtitle)}
        onClose={onDialogClose}
        icon={CloseRoundedIcon}
      />
      <DialogContent dividers className={classes.dialogContent}>
        <Grid container>
          <Grid item xs={12}>
            <NewContentSelect/>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.cardsContainer}>
          {
            contentTypes.map(content => (
              <Grid item key={content.name} xs={12} sm={6} md={4} lg={3} xl={2}>
                <NewContentCard
                  headerTitle={content.label}
                  subheader={content.form}
                  imgTitle={formatMessage(translations.previewImage)}
                  img={getPrevImg(content)}
                  onClick={onListItemClick(content)}
                />
              </Grid>
            ))
          }
        </Grid>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button variant="contained" onClick={onDialogClose}>
          <FormattedMessage
            id="newContentDialog.cancel"
            defaultMessage={`Cancel`}
          />
        </Button>

        <Button color="primary" variant="contained" onClick={onTypeOpen(selectContent, contextPath)}>
          <FormattedMessage
            id="newContentDialog.submit"
            defaultMessage={`Open Type`}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
