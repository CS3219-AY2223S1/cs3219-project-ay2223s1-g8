import Badge from "react-bootstrap/Badge";
import { QUESTION_DIFFICULTY } from "../../utils/constants";

import PropTypes from "prop-types";

const DifficultyPill = ({ variant = QUESTION_DIFFICULTY.EASY }) => {
  switch (variant.toUpperCase()) {
    case QUESTION_DIFFICULTY.MEDIUM:
      return (
        <Badge pill bg="warning">
          Medium
        </Badge>
      );

    case QUESTION_DIFFICULTY.HARD:
      return (
        <Badge pill bg="danger">
          Hard
        </Badge>
      );

    default:
      return (
        <Badge pill bg="success">
          Easy
        </Badge>
      );
  }
};

DifficultyPill.propTypes = {
  variant: PropTypes.string,
};

export default DifficultyPill;
