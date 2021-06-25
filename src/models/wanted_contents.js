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
    type:DataTypes.STRING,
    allowNull:false,
  },
  my_score:{
    type:DataTypes.INTEGER,
    default:null,
  },
},
{
  timestamps: true,
  paranoid: true,
  underscored: true,
},
);

const initialize = (models) => {
  models.wanted_contents.belongsTo(models.users,{
    as: 'user',
    foreignKey: {
      name: 'user_id',
      allowNull: false,
    },
  })
}
export default {
    model: wanted_contents,
    initialize
  };