import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Images from "../constants/Images";
import { argonTheme } from '../constants';
import { fetchConsultationsRdv } from './fetchElement/fetchConsultation';
import { fetchRdv } from './fetchElement/fetchRdvs';
import { useUserData } from '../contexts/useUserData';



const CardConsult = (props)=> {

    const { navigation, item, horizontal, full, style, ctaColor, imageStyle } = props;
    
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    const {userData, updateRdv, updateConsultation} = useUserData()

    const fconsults = (rdv_id) =>{
      fetchRdv(rdv_id,updateRdv);
      navigation.navigate("New_consultation")
    }

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback onPress={() => fconsults(item._id)}>
          <Block flex style={imgContainer}>
          <Image source={Images.rdvImage} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => fconsults(item._id)}>
          <Block flex space="between" style={styles.cardDescription}>
            <Text size={14} style={styles.cardTitle}>Name : {item.rdv.patient.nom} {item.rdv.patient.prenom}</Text>
            <Text size={14} style={styles.cardTitle}>Phone : {item.rdv.patient.tel}</Text>
            <Text size={14} style={styles.cardTitle}>Date : {new Date(item.dateConsult).toISOString().split('T')[0]}</Text>
            <Text size={12} muted={!ctaColor} color={ctaColor || argonTheme.COLORS.ACTIVE} bold> Hour {
                        `${new Date(item.dateConsult).getHours()}:${String(new Date(item.dateConsult).getMinutes()).padStart(2, '0')}`
                      }</Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }


CardConsult.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6
    
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default withNavigation(CardConsult);