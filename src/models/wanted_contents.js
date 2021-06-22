import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const wanted_contents = Sequelize.define('wanted_contents',
{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    allowNull:false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    unique:true,
    allowNull: false,
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  status:{
    type:DataTypes.STRING(200),
    allowNull:false,
  },
  my_score:{
    type:DataTypes.INTEGER,
  },
},
{
  timestamps: true,
  paranoid: true,
  underscored: true,
});
export default {
    model: wanted_contents,
  };
  