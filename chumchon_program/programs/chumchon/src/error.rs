use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("User does not have enough tokens to join this group")]
    InsufficientTokenBalance,
    #[msg("User does not have enough SOL to join this whale group")]
    InsufficientSolBalance,
    #[msg("User is not a member of this group")]
    NotGroupMember,
    #[msg("User is not an admin of this group")]
    NotGroupAdmin,
    #[msg("Only the creator can perform this action")]
    NotGroupCreator,
    #[msg("Only the creator can post in a channel")]
    ChannelPostingRestricted,
    #[msg("This invite has expired")]
    InviteExpired,
    #[msg("This invite has reached its maximum number of uses")]
    InviteUsed,
    #[msg("This meme challenge has already ended")]
    ChallengeEnded,
    #[msg("This meme challenge has not started yet")]
    ChallengeNotStarted,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Username is too long.")]
    NameTooLong,
    #[msg("Bio is too long.")]
    BioTooLong,
    #[msg("Invalid mint for NFT profile picture.")]
    InvalidMint,
    #[msg("Invalid amount.")]
    InvalidAmount,
    #[msg("Invalid recipient for tip.")]
    InvalidRecipient,
    #[msg("Content is too long.")]
    ContentTooLong,
    #[msg("URL is too long.")]
    UrlTooLong,
    #[msg("Title is too long.")]
    TitleTooLong,
    #[msg("Description is too long.")]
    DescriptionTooLong,
    #[msg("Prompt is too long.")]
    PromptTooLong,
    #[msg("Code is too long.")]
    CodeTooLong,
    #[msg("Invalid max uses for invite.")]
    InvalidMaxUses,
    #[msg("Expiry date is in the past.")]
    InvalidExpiry,
    #[msg("Invalid invite.")]
    InvalidInvite,
    #[msg("Challenge is not active.")]
    ChallengeInactive,
    #[msg("You have already voted.")]
    AlreadyVoted,
    #[msg("You cannot vote for your own submission.")]
    CannotVoteOwnSubmission,
    #[msg("Challenge has not ended yet.")]
    ChallengeNotEnded,
    #[msg("Challenge has already been completed.")]
    ChallengeAlreadyCompleted,
    #[msg("No submissions to determine a winner.")]
    NoSubmissions,
    #[msg("Tutorial has already been completed.")]
    TutorialAlreadyCompleted,
    #[msg("Invalid tutorial ID.")]
    InvalidTutorialId,
    #[msg("The escrow has already been accepted.")]
    EscrowAlreadyAccepted,
    #[msg("The escrow has expired.")]
    EscrowExpired,
    #[msg("The escrow has not been accepted by the counterparty yet.")]
    EscrowNotAccepted,
    #[msg("You are not the owner of this account.")]
    NotOwner,
    #[msg("You do not hold the required NFT.")]
    NoNFT,
    #[msg("The token is not valid for this group.")]
    InvalidToken,
    #[msg("The NFT is not valid for this group.")]
    InvalidNFT,
}